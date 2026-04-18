import { Map } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SoonCard } from "@/components/shared/SoonCard";

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="roadmap"
        title="D-day 로드맵"
        subtitle="목표를 역산한 주간·일간 플랜."
      />
      <SoonCard
        icon={Map}
        title="AI 개인화 로드맵"
        description="목표 대학·성적·시작 성적을 넣으면 주간 플랜이 자동 생성되고, 실행 결과에 따라 매주 재조정됩니다. 프리미엄 기능이라 Phase 2에서 열립니다."
        phase="phase 2"
        tint="var(--lavender)"
      />
    </>
  );
}
