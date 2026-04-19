"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { createPostAction } from "@/app/actions/community";
import { cn } from "@/lib/cn";

export function PostComposer({ room }: { room: string }) {
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(room === "고민");
  const [pending, startT] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setError(null);
    startT(async () => {
      const r = await createPostAction({
        room,
        content,
        isAnonymous: anon,
      });
      if (r.ok) {
        setText("");
      } else {
        setError(
          r.reason === "unauthenticated"
            ? "로그인이 필요합니다"
            : r.reason === "too_long"
              ? "500자를 넘을 수 없어요"
              : r.reason === "empty"
                ? "내용을 입력해주세요"
                : `저장 실패: ${r.reason}`
        );
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      className="frosted flex flex-col gap-2 rounded-3xl p-4 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="같은 길 위에 있는 사람들과 나누고 싶은 이야기…"
        maxLength={500}
        rows={3}
        className="resize-none rounded-2xl bg-white/70 px-4 py-3 text-sm text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAnon((a) => !a)}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              anon
                ? "bg-[var(--text-dark)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-mid)]"
            )}
          >
            {anon ? "🕶 익명" : "🙂 닉네임"}
          </button>
          <span className="text-[11px] text-[var(--text-light)]">
            {text.length}/500
          </span>
        </div>
        <button
          type="submit"
          disabled={pending || !text.trim()}
          className="flex items-center gap-1.5 rounded-full bg-[var(--cta)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          <Send size={12} />
          {pending ? "올리는 중…" : "올리기"}
        </button>
      </div>
      {error && (
        <p className="rounded-xl bg-[var(--danger)]/10 px-3 py-2 text-[11px] text-[var(--danger)]">
          {error}
        </p>
      )}
    </form>
  );
}
