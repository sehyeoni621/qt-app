"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "@/components/shared/Toast";
import { cn } from "@/lib/cn";
import { ExamList } from "@/features/exam/ExamList";
import { ExamRecords } from "@/features/exam/ExamRecords";

type Tab = "take" | "history";

export default function ExamPage() {
  const [tab, setTab] = useState<Tab>("take");

  return (
    <>
      <PageHeader
        eyebrow="exam"
        title="모의고사"
        subtitle="평가원 기출부터 등급 추정까지."
      />

      {/* 탭 */}
      <div className="px-5 pb-3">
        <div className="flex rounded-full bg-white/50 p-1 ring-1 ring-[var(--border)] backdrop-blur">
          {(
            [
              { id: "take" as Tab, label: "응시하기" },
              { id: "history" as Tab, label: "내 기록" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-[var(--text-dark)] text-white"
                  : "text-[var(--text-mid)]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "take" && (
        <ExamList
          onPick={() =>
            toast("실전 응시는 Phase 2에서 열려요. 일단 리스트부터 탐색!")
          }
        />
      )}
      {tab === "history" && <ExamRecords />}
    </>
  );
}
