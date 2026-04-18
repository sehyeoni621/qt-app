import { Timer } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SoonCard } from "@/components/shared/SoonCard";

export default function StudyPage() {
  return (
    <>
      <PageHeader
        eyebrow="study"
        title="학습 타이머"
        subtitle="시간이 아니라 질(QI)을 잰다."
      />
      <SoonCard
        icon={Timer}
        title="스마트 타이머 + QI 계산기"
        description="과목 선택 → 집중모드 다크 타이머 → 문제풀이 카운터 → 부측 방지 팝업 → 세션 종료 시 QI 산출. 이 화면이 큐티의 심장입니다."
        phase="step 4"
      />
    </>
  );
}
