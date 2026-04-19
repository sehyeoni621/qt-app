"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { addTodoAction, toggleTodoAction } from "@/app/actions/home";
import { SUBJECT_TINT, type Subject } from "./mockData";
import { cn } from "@/lib/cn";

export type TodoItem = {
  id: string;
  text: string;
  subject: Subject | null;
  minutes: number | null;
  done: boolean;
};

export function TodoList({ initial }: { initial: TodoItem[] }) {
  const [todos, setTodos] = useState<TodoItem[]>(initial);
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftSubject, setDraftSubject] = useState<Subject>("수학");

  const doneCount = todos.filter((t) => t.done).length;

  const toggle = (id: string) => {
    let nextDone = false;
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        nextDone = !t.done;
        return { ...t, done: nextDone };
      })
    );
    startTransition(() => {
      toggleTodoAction(id, nextDone).catch(() => {});
    });
  };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    const optimistic: TodoItem = {
      id: `pending-${Date.now()}`,
      text,
      subject: draftSubject,
      minutes: 30,
      done: false,
    };
    setTodos((prev) => [...prev, optimistic]);
    setDraft("");
    setAdding(false);
    startTransition(() => {
      addTodoAction({ text, subject: draftSubject, minutes: 30 }).catch(() => {});
    });
  };

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

      {todos.length === 0 && !adding && (
        <p className="mt-3 rounded-2xl bg-white/50 px-3 py-3 text-[12px] leading-relaxed text-[var(--text-mid)]">
          오늘의 할 일을 만들어보세요. 체크할 때마다 작은 성취가 쌓입니다.
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-2">
        {todos.map((t) => {
          const tint = t.subject ? SUBJECT_TINT[t.subject] : "var(--text-mid)";
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggle(t.id)}
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
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{
                    duration: 0.35,
                    type: "tween",
                    ease: "easeOut",
                  }}
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
                    {t.subject && (
                      <span
                        className="rounded-full px-2 py-0.5 font-medium"
                        style={{
                          background: `color-mix(in oklab, ${tint} 18%, white)`,
                          color: tint,
                        }}
                      >
                        {t.subject}
                      </span>
                    )}
                    {t.minutes != null && (
                      <span className="text-[var(--text-light)]">
                        {t.minutes}분 예상
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* 추가 */}
      {adding ? (
        <div className="mt-2 rounded-2xl bg-white/80 p-3 ring-1 ring-[var(--border-strong)]">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
              if (e.key === "Escape") {
                setAdding(false);
                setDraft("");
              }
            }}
            placeholder="할 일을 입력하고 Enter"
            className="w-full bg-transparent text-sm outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {(["국어", "수학", "영어", "탐구"] as Subject[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraftSubject(s)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors",
                    draftSubject === s
                      ? "bg-[var(--text-dark)] text-white"
                      : "bg-[var(--bg-subtle)] text-[var(--text-mid)]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={add}
              disabled={!draft.trim()}
              className="rounded-full bg-[var(--cta)] px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
            >
              추가
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[var(--border-strong)] bg-white/30 py-2.5 text-xs font-medium text-[var(--text-mid)] transition-colors hover:bg-white/60"
        >
          <Plus size={14} /> 할 일 추가
        </button>
      )}
    </div>
  );
}
