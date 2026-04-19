import type { DBSession } from "@/lib/supabase/queries";

const DAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function aggregateWeeklyQI(
  sessions: DBSession[]
): { day: string; qi: number; date: string }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { day: string; qi: number; date: string }[] = [];

  const byDate = new Map<string, number>();
  for (const s of sessions) {
    const key = ymd(new Date(s.ended_at));
    byDate.set(key, (byDate.get(key) ?? 0) + (s.qi_total ?? 0));
  }

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = ymd(d);
    const isToday = i === 0;
    days.push({
      day: isToday ? "오늘" : DAY_LABELS_KO[d.getDay()],
      qi: Math.min(120, Math.round(byDate.get(key) ?? 0)),
      date: key,
    });
  }
  return days;
}

export function aggregateTodayBreakdown(sessions: DBSession[]): {
  time: number;
  solves: number;
  accuracy: number;
} {
  const todayKey = ymd(new Date());
  const todays = sessions.filter((s) => ymd(new Date(s.ended_at)) === todayKey);
  if (todays.length === 0) return { time: 0, solves: 0, accuracy: 0 };

  const totalSeconds = todays.reduce((a, s) => a + s.seconds, 0);
  const totalCorrect = todays.reduce((a, s) => a + s.correct, 0);
  const totalWrong = todays.reduce((a, s) => a + s.wrong, 0);
  const problems = totalCorrect + totalWrong;

  // 0-100 스케일로 변환
  // 시간: 6시간(21,600초) = 100점 기준
  const timeScore = Math.min(100, Math.round((totalSeconds / (6 * 3600)) * 100));
  // 풀이: 하루 40문제 = 100
  const solvesScore = Math.min(100, Math.round((problems / 40) * 100));
  // 정답률
  const accuracyScore =
    problems === 0 ? 0 : Math.round((totalCorrect / problems) * 100);

  return {
    time: timeScore,
    solves: solvesScore,
    accuracy: accuracyScore,
  };
}

export function sumTodayQI(sessions: DBSession[]): number {
  const todayKey = ymd(new Date());
  return sessions
    .filter((s) => ymd(new Date(s.ended_at)) === todayKey)
    .reduce((a, s) => a + s.qi_total, 0);
}

export function weekAverageDelta(
  weekly: { day: string; qi: number }[]
): number {
  // 오늘 vs 전주 평균(월~토) 비교
  if (weekly.length < 2) return 0;
  const today = weekly[weekly.length - 1].qi;
  const priorSix = weekly.slice(0, -1);
  const avgPrior =
    priorSix.reduce((a, d) => a + d.qi, 0) / Math.max(1, priorSix.length);
  return Math.round(today - avgPrior);
}
