import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SoonCard } from "@/components/shared/SoonCard";

export default function ExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="exam"
        title="모의고사"
        subtitle="평가원 기출부터 실전 OMR까지."
      />
      <SoonCard
        icon={ClipboardList}
        title="응시하기 · 내 기록"
        description="AI 추천 카드 · 기출 리스트 · 최근 6주 추이 · 등급 추정까지. 이번 단계에선 UI 구조만 올립니다."
        phase="step 5"
        tint="var(--gold)"
      />
    </>
  );
}
