-- 큐티 (QT) 초기 스키마
-- Supabase SQL Editor에서 전체 복사 → Run

-- ───────── 확장 ─────────
create extension if not exists "uuid-ossp";

-- ───────── profiles ─────────
-- auth.users 확장. 닉네임·목표·학년정보.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  grad_year int,
  target_university text,
  target_dday date default '2026-11-19',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 가입 시 자동으로 profiles 생성하는 트리거
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

-- ───────── RLS ─────────
alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.mood_checkins enable row level security;
alter table public.todos enable row level security;

-- 본인 행만 CRUD
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_self'
  ) then
    create policy profiles_self on public.profiles
      for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'study_sessions' and policyname = 'sessions_self'
  ) then
    create policy sessions_self on public.study_sessions
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'mood_checkins' and policyname = 'moods_self'
  ) then
    create policy moods_self on public.mood_checkins
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'todos' and policyname = 'todos_self'
  ) then
    create policy todos_self on public.todos
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 기존 사용자(ed4421 등)에 대해 profile 백필
insert into public.profiles (id, nickname)
select u.id,
       coalesce(
         u.raw_user_meta_data->>'nickname',
         split_part(coalesce(u.email, ''), '@', 1)
       )
from auth.users u
on conflict (id) do nothing;
