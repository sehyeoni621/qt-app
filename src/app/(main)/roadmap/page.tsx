import { Map, TrendingUp, CalendarCheck2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SoonCard } from "@/components/shared/SoonCard";
import { computeDDay } from "@/features/home/dday";

export default function RoadmapPage() {
  const dday = computeDDay();
  // 간단한 주 계산: 남은 일수 / 7
  const weeks = Math.max(0, Math.ceil(dday.days / 7));

  return (
    <>
      <PageHeader
        eyebrow="roadmap"
        title="D-day 로드맵"
        subtitle="목표를 역산한 주간·일간 플랜."
      />

      <div className="px-5 pb-2">
        <div className="frosted rounded-3xl p-5 shadow-[0_16px_50px_-30px_rgba(31,35,64,0.2)]">
          <p className="text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
            2026 수능까지
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[44px] leading-none font-semibold text-[var(--text-dark)]">
              {dday.label}
            </span>
            <span className="text-sm text-[var(--text-mid)]">
              약 {weeks}주 남음
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <MiniStat
              icon={CalendarCheck2}
              label="주간 플랜"
              value="미설정"
              tint="var(--cta)"
            />
            <MiniStat
              icon={TrendingUp}
              label="목표 대학"
              value="미설정"
              tint="var(--gold)"
            />
            <MiniStat
              icon={Map}
              label="진도"
              value="—"
              tint="var(--lavender)"
            />
          </div>
        </div>
      </div>

      <SoonCard
        icon={Map}
        title="AI 개인화 로드맵"
        description="목표 대학·시작 성적·과목 우선순위를 입력하면 주간 플랜이 자동 생성되고, 실행 결과에 따라 매주 재조정됩니다. 프리미엄 Phase 2에서 열립니다."
        phase="phase 2"
        tint="var(--lavender)"
      />
    </>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Map;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-3 ring-1 ring-[var(--border-strong)]">
      <div
        className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background: `color-mix(in oklab, ${tint} 18%, white)`,
          color: tint,
        }}
      >
        <Icon size={15} />
      </div>
      <p className="mt-1.5 text-[10px] tracking-wide text-[var(--text-light)] uppercase">
        {label}
      </p>
      <p className="text-[12px] font-semibold text-[var(--text-dark)]">
        {value}
      </p>
    </div>
  );
}
