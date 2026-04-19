"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { saveStudySessionAction } from "@/app/actions/session";
import { computeQI, formatHMS } from "./qi";
import { useTimerStore } from "./store";
import { SUBJECT_META } from "./subjects";

export function ResultSheet() {
  const router = useRouter();
  const { subject, seconds, correct, wrong, focus, goPicker } = useTimerStore();
  const qi = computeQI({ seconds, correct, wrong, focus });
  const tint = subject ? SUBJECT_META[subject].tint : "var(--cta)";
  const problems = correct + wrong;

  const [saveStatus, setSaveStatus] = useState<
    "saving" | "saved" | "skipped" | "error"
  >("saving");
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    if (!subject || seconds < 3) {
      setSaveStatus("skipped");
      return;
    }
    const started = new Date(Date.now() - seconds * 1000).toISOString();
    saveStudySessionAction({
      subject,
      seconds,
      focus,
      correct,
      wrong,
      qi_total: qi.total,
      started_at: started,
    })
      .then((r) => {
        if (r.ok) {
          setSaveStatus("saved");
          router.refresh();
        } else {
          setSaveStatus(r.reason === "unauthenticated" ? "skipped" : "error");
        }
      })
      .catch(() => setSaveStatus("error"));
  }, [subject, seconds, focus, correct, wrong, qi.total, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="w-full max-w-md rounded-t-[32px] bg-[var(--bg-card-strong)] p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-2xl"
      >
        <div className="mx-auto h-1 w-12 rounded-full bg-[var(--border-strong)]" />

        <div className="mt-4 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase"
            style={{
              background: `color-mix(in oklab, ${tint} 20%, white)`,
              color: tint,
            }}
          >
            {subject ?? "세션"}
          </span>
          <span className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            session ended
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[var(--text-dark)]">
            이번 세션의 QI
          </h2>
          <span
            className="text-[11px] font-medium"
            style={{
              color:
                saveStatus === "saved"
                  ? "var(--success)"
                  : saveStatus === "error"
                    ? "var(--danger)"
                    : "var(--text-light)",
            }}
          >
            {saveStatus === "saving" && "저장 중…"}
            {saveStatus === "saved" && "✓ 기록 저장됨"}
            {saveStatus === "skipped" && "로그인 시 저장"}
            {saveStatus === "error" && "저장 실패 (DB 확인 필요)"}
          </span>
        </div>

        <div className="mt-4 flex items-end gap-3">
          <span className="text-[80px] leading-none font-semibold tracking-tight text-[var(--text-dark)]">
            {qi.total}
          </span>
          <span className="mb-3 rounded-full bg-[var(--cta)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--cta)]">
            {qi.total >= 70
              ? "우수 세션"
              : qi.total >= 40
                ? "괜찮은 세션"
                : "살짝 부족"}
          </span>
        </div>

        {/* 세 가지 스탯 */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="시간" value={formatHMS(seconds)} />
          <Stat label="풀이" value={problems.toString()} />
          <Stat
            label="정답률"
            value={problems === 0 ? "—" : `${qi.accuracyRate}%`}
          />
        </div>

        {/* QI 기여도 분해 */}
        <div className="mt-5 rounded-2xl bg-[var(--bg-subtle)] p-4">
          <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            QI 기여도
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
            <ContribRow label="학습 시간" value={qi.time} />
            <ContribRow label="정답률" value={qi.accuracy} />
            <ContribRow label="집중도" value={qi.focus} />
            <ContribRow label="풀이수" value={qi.solves} />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => {
              goPicker();
            }}
            className="flex-1 rounded-full bg-white px-4 py-3.5 text-sm font-medium text-[var(--text-mid)] ring-1 ring-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
          >
            과목 다시 고르기
          </button>
          <button
            type="button"
            onClick={() => {
              goPicker();
              router.push("/");
            }}
            className="flex-1 rounded-full bg-[var(--text-dark)] px-4 py-3.5 text-sm font-semibold text-white hover:opacity-90"
          >
            홈으로
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 text-center ring-1 ring-[var(--border-strong)]">
      <p className="text-[11px] tracking-wide text-[var(--text-mid)] uppercase">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--text-dark)] tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ContribRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[var(--text-mid)]">{label}</span>
      <span className="font-semibold text-[var(--text-dark)] tabular-nums">
        +{value}
      </span>
    </div>
  );
}
