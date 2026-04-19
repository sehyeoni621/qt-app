"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Pause, Play, X } from "lucide-react";
import { useEffect } from "react";
import { useTimerStore } from "./store";
import { formatHMS } from "./qi";
import { SUBJECT_META } from "./subjects";
import { cn } from "@/lib/cn";

export function FocusMode() {
  const {
    subject,
    seconds,
    paused,
    correct,
    wrong,
    focus,
    pause,
    resume,
    tick,
    bumpCorrect,
    bumpWrong,
    setFocus,
    end,
    checkOpen,
  } = useTimerStore();

  useEffect(() => {
    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  const total = correct + wrong;
  const acc = total === 0 ? 0 : Math.round((correct / total) * 100);
  const subjectTint = subject ? SUBJECT_META[subject].tint : "var(--cta)";

  return (
    <motion.section
      role="region"
      aria-label="집중 모드"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-[var(--text-on-frame)]"
      style={{
        background:
          "radial-gradient(120% 60% at 50% 0%, #1F2340 0%, #141733 70%)",
      }}
    >
      {/* 상단 */}
      <header className="flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+16px)] pb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase"
            style={{
              background: `color-mix(in oklab, ${subjectTint} 30%, transparent)`,
              color: "white",
            }}
          >
            {subject}
          </span>
          <span className="text-[11px] tracking-[0.25em] text-white/50 uppercase">
            focus
          </span>
        </div>
        <button
          type="button"
          onClick={end}
          aria-label="세션 종료"
          className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </header>

      {/* 중앙 타이머 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative">
          {/* 펄스 링 */}
          {!paused && !checkOpen && (
            <motion.div
              aria-hidden
              initial={{ scale: 1, opacity: 0.35 }}
              animate={{ scale: 1.12, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 0 8px ${subjectTint}` }}
            />
          )}
          <div
            className="relative flex h-64 w-64 items-center justify-center rounded-full ring-1"
            style={{
              background:
                "radial-gradient(70% 70% at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col items-center">
              <span className="font-mono text-[44px] leading-none font-semibold tracking-wider tabular-nums">
                {formatHMS(seconds)}
              </span>
              <span className="mt-2 text-[11px] tracking-[0.3em] text-white/50 uppercase">
                {paused ? "paused" : "recording"}
              </span>
            </div>
          </div>
        </div>

        {/* 집중도 도트 */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= focus;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setFocus(n)}
                aria-label={`집중도 ${n}`}
                className={cn(
                  "h-3 w-3 rounded-full transition-all",
                  active ? "scale-110" : "opacity-40"
                )}
                style={{
                  background: active ? subjectTint : "rgba(255,255,255,0.25)",
                }}
              />
            );
          })}
          <span className="ml-2 text-[11px] tracking-wide text-white/50 uppercase">
            focus {focus}/5
          </span>
        </div>

        {/* 문제풀이 카운터 */}
        <div className="flex w-full max-w-[320px] items-stretch gap-2 px-6">
          <button
            type="button"
            onClick={bumpCorrect}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-center backdrop-blur transition-colors hover:bg-white/15 active:scale-[0.98]"
          >
            <span className="text-[11px] tracking-wide text-white/60 uppercase">
              맞음
            </span>
            <span className="text-2xl font-semibold tabular-nums">
              {correct}
            </span>
          </button>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 px-4 text-center backdrop-blur">
            <span className="text-[11px] tracking-wide text-white/50 uppercase">
              정답률
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {acc}
              <span className="text-xs text-white/60">%</span>
            </span>
          </div>
          <button
            type="button"
            onClick={bumpWrong}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-center backdrop-blur transition-colors hover:bg-white/15 active:scale-[0.98]"
          >
            <span className="text-[11px] tracking-wide text-white/60 uppercase">
              오답
            </span>
            <span className="text-2xl font-semibold tabular-nums">
              {wrong}
            </span>
          </button>
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <footer className="flex items-center justify-center gap-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        {paused ? (
          <button
            type="button"
            onClick={resume}
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur hover:bg-white/15"
          >
            <Play size={14} fill="currentColor" /> 재개
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur hover:bg-white/15"
          >
            <Pause size={14} fill="currentColor" /> 일시정지
          </button>
        )}
        <button
          type="button"
          onClick={end}
          className="flex items-center gap-2 rounded-full bg-[var(--cta)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.7)] hover:bg-[var(--cta-hover)]"
        >
          <Check size={14} strokeWidth={3} /> 세션 종료
        </button>
      </footer>

      {/* 부측 방지 팝업 */}
      <AnimatePresence>{checkOpen && <FocusCheckModal />}</AnimatePresence>
    </motion.section>
  );
}

function FocusCheckModal() {
  const answer = useTimerStore((s) => s.answerCheck);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="alertdialog"
      aria-live="assertive"
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mx-6 w-full max-w-sm rounded-3xl bg-[var(--bg-card-strong)] p-6 text-[var(--text-dark)] shadow-2xl"
      >
        <p className="text-[11px] tracking-[0.3em] text-[var(--text-mid)] uppercase">
          focus check
        </p>
        <h3 className="mt-1 text-xl font-semibold">아직 집중 중이신가요?</h3>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          부측 방지 — 답을 해주셔야 이번 세션의 QI가 인정됩니다.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => answer(false)}
            className="flex-1 rounded-full bg-white px-4 py-3 text-sm font-medium text-[var(--text-mid)] ring-1 ring-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
          >
            잠시 딴짓
          </button>
          <button
            type="button"
            onClick={() => answer(true)}
            className="flex-1 rounded-full bg-[var(--text-dark)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            네, 집중 중
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
