import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PostComposer } from "@/features/community/PostComposer";
import { PostCard, type PostItem } from "@/features/community/PostCard";
import { getRoom } from "@/features/community/rooms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room: roomParam } = await params;
  const roomId = decodeURIComponent(roomParam);
  const room = getRoom(roomId);
  if (!room) notFound();

  let currentUserId: string | null = null;
  let posts: PostItem[] = [];

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;

    const { data } = await supabase
      .from("community_posts")
      .select(
        "id, user_id, content, created_at, author_nickname, is_anonymous, likes_count"
      )
      .eq("room", roomId)
      .order("created_at", { ascending: false })
      .limit(50);

    let likedIds = new Set<string>();
    if (user && data && data.length > 0) {
      const { data: likes } = await supabase
        .from("community_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in(
          "post_id",
          data.map((p) => p.id)
        );
      likedIds = new Set((likes ?? []).map((l) => l.post_id as string));
    }

    posts = (data ?? []).map((p) => ({
      id: p.id as string,
      content: p.content as string,
      created_at: p.created_at as string,
      author_nickname: p.author_nickname as string | null,
      is_anonymous: p.is_anonymous as boolean,
      likes_count: (p.likes_count as number) ?? 0,
      liked_by_me: likedIds.has(p.id as string),
      is_mine: !!user && p.user_id === user.id,
    }));
  } catch {
    posts = [];
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5">
        <Link
          href="/community"
          className="flex items-center gap-1 rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-[var(--text-mid)] ring-1 ring-[var(--border-strong)]"
        >
          <ArrowLeft size={13} /> 방 목록
        </Link>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
          style={{ background: room.tint }}
        >
          {room.emoji} {room.name}
        </span>
      </div>

      <PageHeader
        eyebrow={`community / ${room.id}`}
        title={room.name}
        subtitle={room.description}
      />

      <div className="flex flex-col gap-3 px-5 pb-6">
        {currentUserId ? (
          <PostComposer room={room.id} />
        ) : (
          <Link
            href="/login"
            className="frosted rounded-3xl p-4 text-center text-sm font-medium text-[var(--text-dark)]"
          >
            로그인하고 이야기 나누기 →
          </Link>
        )}

        {posts.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-white/50 p-6 text-center">
            <p className="text-sm text-[var(--text-mid)]">
              아직 글이 없어요
            </p>
            <p className="mt-1 text-[11px] text-[var(--text-light)]">
              첫 이야기를 남겨보세요.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {posts.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
