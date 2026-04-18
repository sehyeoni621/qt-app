import { UserBadge } from "@/components/shared/UserBadge";

function formatToday(now: Date = new Date()) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${week[now.getDay()]}요일 · ${months[now.getMonth()]}`;
}

export function GreetingHeader({
  name,
  dateText,
}: {
  name: string;
  dateText?: string;
}) {
  return (
    <header className="px-5 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-[var(--text-mid)] uppercase">
            dawn study
          </p>
          <h1 className="mt-1 text-[26px] leading-tight font-semibold text-[var(--text-dark)]">
            안녕, {name} <span className="inline-block align-middle">👋</span>
          </h1>
          <p className="mt-1 text-xs text-[var(--text-mid)]">
            {dateText ?? formatToday()}
          </p>
        </div>
        <UserBadge />
      </div>
    </header>
  );
}
