export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pt-8 pb-4">
      {eyebrow && (
        <p className="text-[11px] tracking-[0.3em] text-[var(--text-mid)] uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-2xl font-semibold text-[var(--text-dark)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-[var(--text-mid)]">{subtitle}</p>
      )}
    </header>
  );
}
