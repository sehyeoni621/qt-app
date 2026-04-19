"use client";

import { useState, useTransition } from "react";
import { saveGoalAction } from "@/app/actions/roadmap";
import { cn } from "@/lib/cn";
import type { Subject } from "./generator";

const SUGGESTED_UNIS = [
  "서울대",
  "연세대",
  "고려대",
  "카이스트",
  "의대 (어디든)",
  "한의대",
  "치대",
  "교대",
];

const SUBJECTS: Subject[] = ["국어", "수학", "영어", "탐구"];

export function GoalForm({
  initial,
}: {
  initial?: {
    targetUniversity: string | null;
    targetScore: number | null;
    startScore: number | null;
    prioritySubjects: string[] | null;
    weeklyHours: number | null;
  };
}) {
  const [univ, setUniv] = useState(initial?.targetUniversity ?? "");
  const [target, setTarget] = useState(initial?.targetScore ?? 90);
  const [start, setStart] = useState(initial?.startScore ?? 70);
  const [prio, setPrio] = useState<Subject[]>(
    (initial?.prioritySubjects ?? ["수학"]) as Subject[]
  );
  const [weekly, setWeekly] = useState(initial?.weeklyHours ?? 40);
  const [pending, startT] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const togglePrio = (s: Subject) => {
    setPrio((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startT(() => {
      saveGoalAction({
        targetUniversity: univ.trim() || "미정",
        targetScore: target,
        startScore: start,
        prioritySubjects: prio,
        weeklyHours: weekly,
      }).then((r) => {
        if (!r.ok)
          setError(
            r.reason === "unauthenticated"
              ? "로그인 후 저장됩니다."
              : "저장 실패 (DB 마이그레이션을 먼저 실행하셨나요?)"
          );
      });
    });
  };

  return (
    <form
      onSubmit={submit}
      className="frosted flex flex-col gap-4 rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]"
    >
      <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
        내 목표 설정
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--text-mid)]">
          목표 대학
        </span>
        <input
          value={univ}
          onChange={(e) => setUniv(e.target.value)}
          placeholder="예: 서울대 경영"
          className="rounded-2xl bg-white/80 px-4 py-2.5 text-sm outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
        />
        <div className="mt-1 flex flex-wrap gap-1.5">
          {SUGGESTED_UNIS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUniv(u)}
              className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[11px] text-[var(--text-mid)] hover:bg-white"
            >
              {u}
            </button>
          ))}
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--text-mid)]">
            현재 점수
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={start}
            onChange={(e) => setStart(parseInt(e.target.value || "0"))}
            className="rounded-2xl bg-white/80 px-4 py-2.5 text-sm outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--text-mid)]">
            목표 점수
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value || "0"))}
            className="rounded-2xl bg-white/80 px-4 py-2.5 text-sm outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
          />
        </label>
      </div>

      <div>
        <span className="text-xs font-medium text-[var(--text-mid)]">
          우선 과목 (복수 선택)
        </span>
        <div className="mt-2 flex gap-1.5">
          {SUBJECTS.map((s) => {
            const active = prio.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => togglePrio(s)}
                className={cn(
                  "flex-1 rounded-full py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--text-dark)] text-white"
                    : "bg-white/70 text-[var(--text-mid)] ring-1 ring-[var(--border-strong)]"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-[var(--text-mid)]">
            주당 목표 학습시간
          </span>
          <span className="text-sm font-semibold text-[var(--text-dark)] tabular-nums">
            {weekly}시간
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={70}
          step={1}
          value={weekly}
          onChange={(e) => setWeekly(parseInt(e.target.value))}
          className="accent-[var(--cta)]"
        />
        <div className="flex justify-between text-[10px] text-[var(--text-light)]">
          <span>여유 (10h)</span>
          <span>일반 (40h)</span>
          <span>극한 (70h)</span>
        </div>
      </label>

      {error && (
        <p className="rounded-2xl bg-[var(--danger)]/10 px-3 py-2 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--cta)] py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)] hover:bg-[var(--cta-hover)] disabled:opacity-60"
      >
        {pending ? "저장 중…" : "목표 저장하고 로드맵 생성"}
      </button>
    </form>
  );
}
