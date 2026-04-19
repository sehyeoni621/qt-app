"use client";

import { motion } from "framer-motion";
import { useTimerStore } from "./store";
import { SUBJECT_META, SUBJECTS } from "./subjects";
import { formatHMS } from "./qi";
import { cn } from "@/lib/cn";

export function SubjectPicker() {
  const start = useTimerStore((s) => s.start);
  const options = useTimerStore((s) => s.options);
  const setOption = useTimerStore((s) => s.setOption);

  return (
    <div className="flex flex-col gap-4 px-5 pb-6">
      <p className="text-[13px] text-[var(--text-mid)]">
        어떤 과목부터 시작할까요? 각 카드는 오늘 누적 시간을 보여줘요.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {SUBJECTS.map((subject, i) => {
          const meta = SUBJECT_META[subject];
          const Icon = meta.icon;
          return (
            <motion.button
              key={subject}
              type="button"
              onClick={() => start(subject)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              className="frosted flex flex-col items-start gap-2 rounded-3xl p-5 text-left shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in oklab, ${meta.tint} 20%, white)`,
                  color: meta.tint,
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <span className="text-lg font-semibold text-[var(--text-dark)]">
                {subject}
              </span>
              <span className="text-[11px] text-[var(--text-light)]">
                오늘 누적 {formatHMS(meta.todaySeconds)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="frosted mt-2 rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
        <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
          집중 옵션
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <Toggle
            label="부측 방지 팝업"
            hint="30초마다 집중 상태 체크"
            value={options.antiCheat}
            onChange={(v) => setOption("antiCheat", v)}
          />
          <Toggle
            label="백색소음"
            hint="(곧 열립니다)"
            value={options.whiteNoise}
            onChange={(v) => setOption("whiteNoise", v)}
            disabled
          />
          <Toggle
            label="알림 차단"
            hint="세션 중 알림 배너 숨김"
            value={options.muteNotifs}
            onChange={(v) => setOption("muteNotifs", v)}
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={cn(
        "flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 text-left transition-colors",
        disabled ? "opacity-60" : "hover:bg-white/85"
      )}
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-dark)]">{label}</p>
        {hint && (
          <p className="text-[11px] text-[var(--text-light)]">{hint}</p>
        )}
      </div>
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-10 rounded-full transition-colors",
          value ? "bg-[var(--cta)]" : "bg-[var(--border-strong)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
