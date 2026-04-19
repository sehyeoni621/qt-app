"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EXAM_LIST } from "./mockData";

export function ExamList({ onPick }: { onPick: () => void }) {
  const aiPick = EXAM_LIST.find((e) => e.badge === "AI");
  const rest = EXAM_LIST.filter((e) => e.id !== aiPick?.id);

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
      {aiPick && (
        <motion.button
          type="button"
          onClick={onPick}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl p-5 text-left text-white shadow-[0_20px_60px_-20px_rgba(31,35,64,0.4)]"
          style={{
            background:
              "linear-gradient(135deg, #1F2340 0%, #3A3F72 60%, var(--lavender) 110%)",
          }}
        >
          <div className="relative z-10 flex items-start justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase backdrop-blur">
              <Sparkles size={12} /> AI 맞춤 추천
            </span>
            <span className="text-[11px] tracking-[0.25em] text-white/60 uppercase">
              recommended
            </span>
          </div>
          <h3 className="relative z-10 mt-4 text-xl font-semibold">
            {aiPick.year}학년도 {aiPick.round}
          </h3>
          <p className="relative z-10 mt-1 text-sm text-white/80">
            {aiPick.subject} · {aiPick.timeMin}분 · {aiPick.items}문항
          </p>
          <p className="relative z-10 mt-3 text-[12px] leading-relaxed text-white/70">
            최근 세션의 오답 패턴과 유사한 문제 유형이 많아요. 이번주 취약 영역
            보강에 좋습니다.
          </p>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />
        </motion.button>
      )}

      <p className="mt-2 text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
        평가원 기출
      </p>

      <ul className="flex flex-col gap-2">
        {rest.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={onPick}
              className="flex w-full items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-left ring-1 ring-[var(--border-strong)] transition-colors hover:bg-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[11px] font-semibold text-[var(--text-dark)]">
                {e.year.toString().slice(-2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-dark)]">
                  {e.round} · {e.subject}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-light)]">
                  {e.timeMin}분 · {e.items}문항
                </p>
              </div>
              {e.badge === "NEW" && (
                <span className="rounded-full bg-[var(--cta)] px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
                  new
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
