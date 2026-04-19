import { Users, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
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

      <div className="flex flex-col gap-3 px-5 pb-2">
        <div className="frosted flex items-start gap-3 rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--success)]/15 text-[var(--success)]">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-dark)]">
              N수생 인증 커뮤니티
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--text-mid)]">
              졸업연도 인증을 통과한 사람만 입장합니다. 초·중·고등학생 혼재 없이
              같은 나이대의 대화.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PreviewCard
            icon={Users}
            title="목표군별 방"
            desc="의대·서울대·한의대 등"
            tint="var(--cta)"
          />
          <PreviewCard
            icon={MessageCircle}
            title="익명 고민방"
            desc="슬럼프·멘탈"
            tint="var(--lavender)"
          />
          <PreviewCard
            icon={Sparkles}
            title="멘토 매칭"
            desc="합격자 1:1"
            tint="var(--gold)"
          />
          <PreviewCard
            icon={ShieldCheck}
            title="안전 가드"
            desc="상업 광고·도박 자동 필터"
            tint="var(--success)"
          />
        </div>
      </div>

      <SoonCard
        icon={Users}
        title="Phase 2 후반 오픈"
        description="커뮤니티는 안전·신뢰 설계가 필요해서 MVP 이후 천천히 엽니다. 먼저 만든 학습 지표(QI·오답)가 대화의 근거가 되도록 연동될 예정이에요."
        phase="phase 2"
        tint="var(--success)"
      />
    </>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  desc,
  tint,
}: {
  icon: typeof Users;
  title: string;
  desc: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-[var(--border-strong)]">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          background: `color-mix(in oklab, ${tint} 18%, white)`,
          color: tint,
        }}
      >
        <Icon size={16} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--text-dark)]">
        {title}
      </p>
      <p className="text-[11px] text-[var(--text-light)]">{desc}</p>
    </div>
  );
}
