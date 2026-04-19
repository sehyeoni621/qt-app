"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

type Weekly = { day: string; qi: number }[];

function CircularProgress({
  value,
  size = 96,
  stroke = 10,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const clamp = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp / 100);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(31,35,64,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#qi-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="qi-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--cta)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[28px] leading-none font-semibold text-[var(--text-dark)]">
          {value}
        </span>
        <span className="text-[10px] tracking-wide text-[var(--text-light)] uppercase">
          QI
        </span>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-[var(--text-mid)]">{label}</span>
        <span className="text-[11px] font-semibold text-[var(--text-dark)]">
          {value}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/60">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--cta), var(--warm))",
          }}
        />
      </div>
    </div>
  );
}

export function QIOverview({
  total,
  weekly,
  breakdown,
  deltaWeek,
  empty,
}: {
  total: number;
  weekly: Weekly;
  breakdown: { time: number; solves: number; accuracy: number };
  deltaWeek: number;
  empty: boolean;
}) {
  return (
    <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
          today&apos;s qi
        </p>
        {!empty && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              background:
                deltaWeek >= 0
                  ? "color-mix(in oklab, var(--success) 18%, white)"
                  : "color-mix(in oklab, var(--danger) 18%, white)",
              color: deltaWeek >= 0 ? "var(--success)" : "var(--danger)",
            }}
          >
            {deltaWeek >= 0
              ? `▲ ${deltaWeek}`
              : `▼ ${Math.abs(deltaWeek)}`}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-5">
        <CircularProgress value={total} />
        <div className="min-w-0 flex-1">
          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={weekly}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="qi-area" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--cta)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--cta)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "4px 8px",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "var(--text-mid)" }}
                  itemStyle={{ color: "var(--text-dark)" }}
                  formatter={(v) => [`${v}`, "QI"]}
                />
                <Area
                  type="monotone"
                  dataKey="qi"
                  stroke="var(--cta)"
                  strokeWidth={2}
                  fill="url(#qi-area)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-1 flex justify-between px-0.5 text-[10px] text-[var(--text-light)]">
            {weekly.map((w, i) => (
              <span key={`${w.day}-${i}`}>{w.day}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Bar label="시간" value={breakdown.time} />
        <Bar label="풀이" value={breakdown.solves} />
        <Bar label="정답률" value={breakdown.accuracy} />
      </div>

      {empty && (
        <p className="mt-4 rounded-2xl bg-white/50 px-3 py-2 text-[12px] leading-relaxed text-[var(--text-mid)]">
          아직 오늘 학습 기록이 없어요. 아래 &ldquo;지금 공부 시작&rdquo;에서
          첫 세션을 만들어보세요.
        </p>
      )}
    </div>
  );
}
