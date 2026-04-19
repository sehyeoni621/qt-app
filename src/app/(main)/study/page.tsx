"use client";

import { AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { FocusMode } from "@/features/timer/FocusMode";
import { ResultSheet } from "@/features/timer/ResultSheet";
import { SubjectPicker } from "@/features/timer/SubjectPicker";
import { useTimerStore } from "@/features/timer/store";

export default function StudyPage() {
  const mode = useTimerStore((s) => s.mode);

  return (
    <>
      {mode === "picker" && (
        <>
          <PageHeader
            eyebrow="study"
            title="학습 타이머"
            subtitle="시간이 아니라 질(QI)을 잰다."
          />
          <SubjectPicker />
        </>
      )}

      <AnimatePresence>
        {mode === "focus" && <FocusMode key="focus" />}
        {mode === "result" && <ResultSheet key="result" />}
      </AnimatePresence>
    </>
  );
}
