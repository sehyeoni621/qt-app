"use client";

import { Heart, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deletePostAction, toggleLikeAction } from "@/app/actions/community";
import { cn } from "@/lib/cn";

export type PostItem = {
  id: string;
  content: string;
  created_at: string;
  author_nickname: string | null;
  is_anonymous: boolean;
  likes_count: number;
  liked_by_me: boolean;
  is_mine: boolean;
};

function relativeTime(iso: string): string {
  const now = Date.now();
  const d = new Date(iso).getTime();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export function PostCard({ post }: { post: PostItem }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likes, setLikes] = useState(post.likes_count);
  const [deleted, setDeleted] = useState(false);
  const [, startT] = useTransition();

  if (deleted) return null;

  const author = post.is_anonymous
    ? "익명"
    : (post.author_nickname ?? "익명");

  const like = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((c) => c + (nextLiked ? 1 : -1));
    startT(() => {
      toggleLikeAction(post.id).catch(() => {
        // 롤백
        setLiked(liked);
        setLikes((c) => c + (nextLiked ? -1 : 1));
      });
    });
  };

  const del = () => {
    if (!confirm("정말 삭제할까요?")) return;
    setDeleted(true);
    startT(() => {
      deletePostAction(post.id).catch(() => setDeleted(false));
    });
  };

  return (
    <article className="frosted rounded-3xl p-4 shadow-[0_12px_40px_-30px_rgba(31,35,64,0.2)]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold",
              post.is_anonymous
                ? "bg-[var(--text-dark)] text-white"
                : "bg-[var(--cta)]/20 text-[var(--cta)]"
            )}
          >
            {post.is_anonymous ? "🕶" : author.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-[var(--text-dark)]">
            {author}
          </span>
          <span className="text-[11px] text-[var(--text-light)]">
            · {relativeTime(post.created_at)}
          </span>
        </div>
        {post.is_mine && (
          <button
            type="button"
            onClick={del}
            aria-label="삭제"
            className="rounded-full p-1.5 text-[var(--text-light)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
          >
            <Trash2 size={14} />
          </button>
        )}
      </header>

      <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--text-dark)]">
        {post.content}
      </p>

      <footer className="mt-3 flex items-center gap-4 text-[12px]">
        <button
          type="button"
          onClick={like}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors",
            liked
              ? "bg-[var(--cta)]/15 text-[var(--cta)]"
              : "text-[var(--text-mid)] hover:bg-white/70"
          )}
        >
          <Heart
            size={13}
            fill={liked ? "currentColor" : "none"}
            strokeWidth={2.2}
          />
          <span className="tabular-nums">{likes}</span>
        </button>
      </footer>
    </article>
  );
}
