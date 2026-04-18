export function DDayCard({
  label,
  sub,
  target = "2026 수능",
}: {
  label: string;
  sub: string;
  target?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_20px_60px_-20px_rgba(245,155,130,0.5)]"
      style={{
        background:
          "linear-gradient(135deg, var(--cta) 0%, var(--warm) 60%, var(--gold) 100%)",
      }}
    >
      <div className="relative z-10 flex items-start justify-between">
        <span className="text-[11px] tracking-[0.3em] text-white/80 uppercase">
          d-day
        </span>
        <span className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
          {target}
        </span>
      </div>
      <div className="relative z-10 mt-2 flex items-baseline gap-3">
        <span className="text-[72px] leading-none font-semibold tracking-tight">
          {label}
        </span>
      </div>
      <p className="relative z-10 mt-1 text-sm text-white/85">{sub}</p>

      {/* 배경 장식 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-40 blur-2xl"
        style={{ background: "var(--lavender)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full opacity-30 blur-2xl"
        style={{ background: "white" }}
      />
    </div>
  );
}
