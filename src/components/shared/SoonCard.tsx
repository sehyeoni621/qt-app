import type { LucideIcon } from "lucide-react";

export function SoonCard({
  icon: Icon,
  title,
  description,
  phase,
  tint = "var(--cta)",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
  tint?: string;
}) {
  return (
    <section className="mx-5 mt-3">
      <div className="frosted rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.2)]">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: `color-mix(in oklab, ${tint} 22%, white)` }}
        >
          <Icon size={20} style={{ color: tint }} strokeWidth={2.2} />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-[var(--text-dark)]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-mid)]">
          {description}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase"
            style={{
              background: `color-mix(in oklab, ${tint} 15%, white)`,
              color: tint,
            }}
          >
            {phase}
          </span>
          <span className="text-[11px] text-[var(--text-light)]">
            곧 열립니다
          </span>
        </div>
      </div>
    </section>
  );
}
