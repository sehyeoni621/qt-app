import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SoonCard } from "@/components/shared/SoonCard";

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="community"
        title="N수생 커뮤니티"
        subtitle="같은 목표, 같은 속도의 사람들."
      />
      <SoonCard
        icon={Users}
        title="목표군별 방 · 익명 고민 · 멘토"
        description="졸업연도 인증을 통과한 N수생만 입장. 초·중·고등 혼재 없이 같은 나이대의 대화가 가능합니다. Phase 2 후반에 엽니다."
        phase="phase 2"
        tint="var(--success)"
      />
    </>
  );
}
