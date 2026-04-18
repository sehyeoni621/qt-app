import { SUNEUNG_DATE } from "./mockData";

export function computeDDay(now: Date = new Date()): {
  days: number;
  label: string;
  sub: string;
} {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((SUNEUNG_DATE.getTime() - now.getTime()) / msPerDay);
  const label = diff > 0 ? `D-${diff}` : diff === 0 ? "D-DAY" : `D+${-diff}`;

  const months = Math.floor(diff / 30);
  const sub =
    diff <= 0
      ? "수능 이후"
      : months >= 1
        ? `약 ${months}개월 남음`
        : `${diff}일 남음`;
  return { days: diff, label, sub };
}
