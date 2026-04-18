"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { qiBreakdown, todayQi, weeklyQi } from "./mockData";

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
            background:
              "linear-gradient(90deg, var(--cta), var(--warm))",
          }}
        />
      </div>
    </div>
  );
}

export function QIOverview() {
  return (
    <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
          today&apos;s qi
        </p>
        <span className="rounded-full bg-[var(--success)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--success)]">
          ▲ 7
        </span>
      </div>

      <div className="mt-3 flex items-center gap-5">
        <CircularProgress value={todayQi} />
        <div className="flex-1">
          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyQi}
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
            {weeklyQi.map((w) => (
              <span key={w.day}>{w.day}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Bar label="시간" value={qiBreakdown.time} />
        <Bar label="풀이" value={qiBreakdown.solves} />
        <Bar label="정답률" value={qiBreakdown.accuracy} />
      </div>
    </div>
  );
}
