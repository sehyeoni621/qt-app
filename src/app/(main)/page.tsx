import { PageHeader } from "@/components/shared/PageHeader";
import { UserBadge } from "@/components/shared/UserBadge";

export default function HomePage() {
  return (
    <>
      <div className="flex items-start justify-between px-5 pt-6">
        <p className="text-[11px] tracking-[0.3em] text-[var(--text-mid)] uppercase">
          dawn study
        </p>
        <UserBadge />
      </div>

      <PageHeader title="오늘도 한 계단" subtitle="시간이 아니라 질(QI)." />

      <div className="px-5">
        <div className="frosted rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.2)]">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.25em] text-[var(--text-mid)] uppercase">
              D-day
            </span>
            <span className="rounded-full bg-[var(--cta)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--cta)]">
              수능까지
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[64px] leading-none font-semibold tracking-tight text-[var(--text-dark)]">
              D-16
            </span>
            <span className="text-sm text-[var(--text-mid)]">7개월 남음</span>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] tracking-wide text-[var(--text-light)] uppercase">
          home — built in step 3
        </p>
      </div>
    </>
  );
}
