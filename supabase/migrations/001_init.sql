-- 큐티 (QT) 초기 스키마
-- Supabase SQL Editor에서 전체 복사 → Run
-- (재실행 안전 — create if not exists / on conflict 사용)

-- ───────── 확장 ─────────
create extension if not exists "uuid-ossp";

-- ───────── profiles ─────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  grad_year int,
  target_university text,
  target_dday date default '2026-11-19',
  target_score int,
  start_score int,
  priority_subjects text[],
  weekly_hours int default 40,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 누락 컬럼 보강 (재실행 대비)
alter table public.profiles add column if not exists target_score int;
alter table public.profiles add column if not exists start_score int;
alter table public.profiles add column if not exists priority_subjects text[];
alter table public.profiles add column if not exists weekly_hours int default 40;

-- 가입 시 자동으로 profiles 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nickname',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ───────── study_sessions ─────────
create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (subject in ('국어','수학','영어','탐구')),
  started_at timestamptz not null default now(),
  ended_at timestamptz not null default now(),
  seconds int not null default 0 check (seconds >= 0),
  focus int not null default 3 check (focus between 1 and 5),
  correct int not null default 0 check (correct >= 0),
  wrong int not null default 0 check (wrong >= 0),
  qi_total int not null default 0 check (qi_total >= 0),
  created_at timestamptz default now()
);
create index if not exists study_sessions_user_day_idx
  on public.study_sessions (user_id, ended_at desc);

-- ───────── mood_checkins ─────────
create table if not exists public.mood_checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_at timestamptz not null default now(),
  mood_level int not null check (mood_level between 1 and 5),
  note text,
  created_at timestamptz default now()
);
create index if not exists mood_checkins_user_day_idx
  on public.mood_checkins (user_id, checked_at desc);

-- ───────── todos ─────────
create table if not exists public.todos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  text text not null,
  subject text check (subject in ('국어','수학','영어','탐구')),
  minutes int default 30,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists todos_user_date_idx
  on public.todos (user_id, date desc, position);

-- ───────── community_posts ─────────
create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  room text not null, -- '의대' | '서울대' | '한의대' | '치대' | '사범대' | '고민'
  author_nickname text,
  content text not null,
  is_anonymous boolean not null default false,
  likes_count int not null default 0,
  created_at timestamptz default now()
);
create index if not exists community_posts_room_idx
  on public.community_posts (room, created_at desc);

create table if not exists public.community_likes (
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- 좋아요 트리거: 추가/삭제 시 카운트 업데이트
create or replace function public.bump_likes()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.community_posts set likes_count = likes_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.community_posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

drop trigger if exists on_like_insert on public.community_likes;
create trigger on_like_insert after insert on public.community_likes
for each row execute procedure public.bump_likes();
drop trigger if exists on_like_delete on public.community_likes;
create trigger on_like_delete after delete on public.community_likes
for each row execute procedure public.bump_likes();

-- ───────── RLS ─────────
alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.mood_checkins enable row level security;
alter table public.todos enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_likes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_self') then
    create policy profiles_self on public.profiles
      for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'study_sessions' and policyname = 'sessions_self') then
    create policy sessions_self on public.study_sessions
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'mood_checkins' and policyname = 'moods_self') then
    create policy moods_self on public.mood_checkins
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'todos' and policyname = 'todos_self') then
    create policy todos_self on public.todos
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  -- 커뮤니티: 모든 로그인 사용자 읽기 OK, 작성은 본인만
  if not exists (select 1 from pg_policies where tablename = 'community_posts' and policyname = 'posts_read_all') then
    create policy posts_read_all on public.community_posts for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'community_posts' and policyname = 'posts_write_self') then
    create policy posts_write_self on public.community_posts
      for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'community_posts' and policyname = 'posts_delete_self') then
    create policy posts_delete_self on public.community_posts
      for delete using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'community_likes' and policyname = 'likes_read_all') then
    create policy likes_read_all on public.community_likes for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'community_likes' and policyname = 'likes_write_self') then
    create policy likes_write_self on public.community_likes
      for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'community_likes' and policyname = 'likes_delete_self') then
    create policy likes_delete_self on public.community_likes
      for delete using (auth.uid() = user_id);
  end if;
end $$;

-- 기존 사용자 profile 백필
insert into public.profiles (id, nickname)
select u.id,
       coalesce(
         u.raw_user_meta_data->>'nickname',
         split_part(coalesce(u.email, ''), '@', 1)
       )
from auth.users u
on conflict (id) do nothing;

-- 커뮤니티 샘플 게시글 시드 (한 번만)
do $$
declare sample_user uuid;
begin
  select id into sample_user from auth.users order by created_at asc limit 1;
  if sample_user is not null and not exists (select 1 from public.community_posts limit 1) then
    insert into public.community_posts (user_id, room, author_nickname, content, is_anonymous) values
      (sample_user, '의대', '재현', '오늘 수학 모의 88점. 킬러 2문제만 넘으면 1등급 보이는데 문과 출신이라 미적 진도가 한참. 같은 상황 있으신가요?', false),
      (sample_user, '의대', null, '삼수인데 슬럼프 2주째. 책을 펴도 집중이 안 돼요. 어떻게 버티셨나요?', true),
      (sample_user, '서울대', '민서', '국어 비문학 푸는 방식 바꾸니까 정답률 60→80. 한 번에 두 번 읽지 않고 첫 회독에 지문 구조만 잡고 바로 문제 풀러 가는 방식.', false),
      (sample_user, '한의대', '수빈', '한약재 암기가 진짜 산넘어 산... 탐구 1과목에 하루 3시간 쓰고 있는데 정상인가요?', false),
      (sample_user, '고민', null, '부모님이 재수 한 번 더 하자고 하시는데 전 이제 그만 하고 싶어요. 뭐가 맞는 걸까요.', true);
  end if;
end $$;
