"use client";

import { Edit3, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  type Goal,
  type Subject,
  SUBJECT_META,
  generatePlan,
  progressThisWeek,
} from "./generator";
import { GoalForm } from "./GoalForm";

export function PlanView({
  goal,
  targetDday,
  hoursThisWeek,
}: {
  goal: Goal;
  targetDday: Date;
  hoursThisWeek: number;
}) {
  const [editing, setEditing] = useState(false);
  const weeks = generatePlan(goal, targetDday);
  const currentWeek = weeks[0];
  const next4 = weeks.slice(1, 5);
  const progress = progressThisWeek(hoursThisWeek * 3600, goal.weeklyHours);

  if (editing) {
    return (
      <div className="px-5 pb-6">
        <GoalForm
          initial={{
            targetUniversity: goal.targetUniversity,
            targetScore: goal.targetScore,
            startScore: goal.startScore,
            prioritySubjects: goal.prioritySubjects,
            weeklyHours: goal.weeklyHours,
          }}
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-3 w-full rounded-full bg-white/60 py-2.5 text-xs text-[var(--text-mid)]"
        >
          취소
        </button>
      </div>
    );
  }

  const scoreGap = goal.targetScore - goal.startScore;

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
      {/* 목표 요약 카드 */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--text-dark)] p-5 text-white shadow-[0_20px_60px_-20px_rgba(31,35,64,0.5)]">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-white/60 uppercase">
              my goal
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {goal.targetUniversity}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20"
            aria-label="목표 수정"
          >
            <Edit3 size={14} />
          </button>
        </div>
        <div className="relative z-10 mt-4 flex items-end gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[44px] leading-none font-semibold tabular-nums">
              {goal.startScore}
            </span>
            <span className="text-white/50">→</span>
            <span className="text-[44px] leading-none font-semibold text-[var(--cta)] tabular-nums">
              {goal.targetScore}
            </span>
          </div>
          <span className="mb-1.5 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
            <TrendingUp size={12} /> +{scoreGap}
          </span>
        </div>
        <p className="relative z-10 mt-1 text-xs text-white/60">
          우선 과목: {goal.prioritySubjects.join(", ") || "미지정"}
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full opacity-30 blur-2xl"
          style={{ background: "var(--lavender)" }}
        />
      </div>

      {/* 이번 주 진행률 */}
      <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            이번 주 진행률
          </p>
          <span className="text-xs text-[var(--text-mid)]">
            {hoursThisWeek.toFixed(1)} / {goal.weeklyHours}시간
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[40px] leading-none font-semibold tabular-nums">
            {progress}%
          </span>
          <span className="text-xs text-[var(--text-mid)]">목표 달성</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--cta), var(--gold))",
            }}
          />
        </div>

        {/* 이번 주 과목별 */}
        {currentWeek && (
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {(Object.keys(currentWeek.subjectHours) as Subject[]).map((s) => {
              const meta = SUBJECT_META[s];
              return (
                <div
                  key={s}
                  className="rounded-2xl bg-white/50 p-2.5 text-center"
                  style={{ borderTop: `3px solid ${meta.tint}` }}
                >
                  <p className="text-xs">{meta.emoji}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-[var(--text-dark)]">
                    {s}
                  </p>
                  <p className="text-sm font-semibold tabular-nums">
                    {currentWeek.subjectHours[s]}h
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 다가오는 4주 */}
      <p className="mt-2 text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
        다가오는 4주
      </p>
      <ul className="flex flex-col gap-2">
        {next4.map((w) => (
          <li
            key={w.weekNum}
            className="rounded-2xl bg-white/60 p-3 ring-1 ring-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-dark)]">
                {w.label}
              </span>
              <span className="text-[11px] text-[var(--text-mid)]">
                {w.totalHours}시간
              </span>
            </div>
            <div className="mt-2 flex overflow-hidden rounded-full">
              {(Object.keys(w.subjectHours) as Subject[]).map((s) => {
                const meta = SUBJECT_META[s];
                const pct = (w.subjectHours[s] / w.totalHours) * 100;
                return (
                  <div
                    key={s}
                    className={cn(
                      "flex items-center justify-center text-[10px] font-semibold text-white"
                    )}
                    style={{
                      width: `${pct}%`,
                      background: meta.tint,
                      minHeight: "20px",
                    }}
                    title={`${s} ${w.subjectHours[s]}h`}
                  >
                    {pct > 12 ? s : ""}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-center text-[11px] text-[var(--text-light)]">
        총 {weeks.length}주 계획 · 수능까지 주당{" "}
        {goal.weeklyHours}시간 기준 역산
      </p>
    </div>
  );
}
