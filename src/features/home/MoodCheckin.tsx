"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { setMoodAction } from "@/app/actions/home";
import { MOOD_EMOJIS, type MoodLevel } from "./mockData";
import { cn } from "@/lib/cn";

export function MoodCheckin({
  initialMood = null,
}: {
  initialMood?: MoodLevel | null;
}) {
  const [mood, setMood] = useState<MoodLevel | null>(initialMood);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMood(initialMood);
  }, [initialMood]);

  const current = MOOD_EMOJIS.find((m) => m.level === mood);

  const handle = (level: MoodLevel) => {
    setMood(level);
    startTransition(() => {
      setMoodAction(level).catch(() => {});
    });
  };

  return (
    <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            mood check-in
          </p>
          <p className="mt-0.5 text-sm font-medium text-[var(--text-dark)]">
            {mood
              ? `지금 기분은 "${current?.label}"`
              : "지금 기분은 어때요?"}
          </p>
        </div>
        <AnimatePresence>
          {mood && (
            <motion.span
              key={mood}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="text-3xl"
            >
              {current?.emoji}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-1.5">
        {MOOD_EMOJIS.map(({ level, emoji, label }) => {
          const active = mood === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => handle(level as MoodLevel)}
              aria-label={label}
              aria-pressed={active}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 transition-all",
                active
                  ? "bg-[var(--cta)]/15 ring-2 ring-[var(--cta)]"
                  : "bg-white/40 hover:bg-white/70"
              )}
            >
              <motion.span
                whileTap={{ scale: 0.85 }}
                animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{
                  duration: 0.35,
                  type: "tween",
                  ease: "easeOut",
                }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
