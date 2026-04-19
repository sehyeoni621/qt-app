"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { EXAM_RECORDS, GRADE_TINT, WEEKLY_AVG } from "./mockData";

export function ExamRecords() {
  const latestAvg = WEEKLY_AVG[WEEKLY_AVG.length - 1].avg;
  const prevAvg = WEEKLY_AVG[WEEKLY_AVG.length - 2].avg;
  const trend = latestAvg - prevAvg;

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
      {/* 추이 카드 */}
      <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            최근 6주 평균 점수
          </p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              background:
                trend >= 0
                  ? "color-mix(in oklab, var(--success) 20%, white)"
                  : "color-mix(in oklab, var(--danger) 20%, white)",
              color: trend >= 0 ? "var(--success)" : "var(--danger)",
            }}
          >
            {trend >= 0 ? `▲ ${trend}` : `▼ ${Math.abs(trend)}`}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[44px] leading-none font-semibold text-[var(--text-dark)] tabular-nums">
            {latestAvg}
          </span>
          <span className="text-sm text-[var(--text-mid)]">/ 100 · 이번 주</span>
        </div>
        <div className="mt-3 h-24 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={WEEKLY_AVG}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="exam-area" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--cta)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--cta)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "var(--text-light)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "4px 8px",
                  fontSize: 11,
                }}
                formatter={(v) => [`${v}점`, "평균"]}
              />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="var(--cta)"
                strokeWidth={2}
                fill="url(#exam-area)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 응시 기록 리스트 */}
      <p className="mt-2 text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
        응시 기록
      </p>
      <ul className="flex flex-col gap-2">
        {EXAM_RECORDS.map((r) => {
          const tint = GRADE_TINT[r.grade];
          return (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-[var(--border-strong)]"
            >
              <div
                className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl font-semibold"
                style={{
                  background: `color-mix(in oklab, ${tint} 18%, white)`,
                  color: tint,
                }}
              >
                <span className="text-[9px] tracking-wide uppercase opacity-70">
                  grade
                </span>
                <span className="text-base leading-none">{r.grade}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-dark)]">
                  {r.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-light)]">
                  {r.subject} · {r.date}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-[var(--text-dark)] tabular-nums">
                  {r.score}
                </span>
                <span
                  className="text-[11px] font-medium tabular-nums"
                  style={{
                    color: r.delta >= 0 ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {r.delta >= 0 ? `+${r.delta}` : r.delta}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
