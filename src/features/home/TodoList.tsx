"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SUBJECT_TINT } from "./mockData";
import { useHomeStore } from "./store";
import { cn } from "@/lib/cn";

export function TodoList() {
  const todos = useHomeStore((s) => s.todos);
  const toggleTodo = useHomeStore((s) => s.toggleTodo);
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
          today&apos;s plan
        </p>
        <span className="text-[11px] font-medium text-[var(--text-mid)]">
          {doneCount} / {todos.length} 완료
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {todos.map((t) => {
          const tint = SUBJECT_TINT[t.subject];
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggleTodo(t.id)}
                aria-pressed={t.done}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl bg-white/60 px-3 py-3 text-left transition-colors hover:bg-white/85",
                  t.done && "bg-white/30"
                )}
              >
                <motion.span
                  animate={
                    t.done
                      ? { scale: [1, 1.25, 1], rotate: [0, -6, 0] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.35, type: "spring" as const }}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                    t.done
                      ? "bg-[var(--success)] text-white"
                      : "border border-[var(--border-strong)] bg-white"
                  )}
                >
                  {t.done && <Check size={14} strokeWidth={3} />}
                </motion.span>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      t.done
                        ? "text-[var(--text-light)] line-through"
                        : "text-[var(--text-dark)]"
                    )}
                  >
                    {t.text}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                    <span
                      className="rounded-full px-2 py-0.5 font-medium"
                      style={{
                        background: `color-mix(in oklab, ${tint} 18%, white)`,
                        color: tint,
                      }}
                    >
                      {t.subject}
                    </span>
                    <span className="text-[var(--text-light)]">
                      {t.minutes}분 예상
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
