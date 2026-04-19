export type Subject = "국어" | "수학" | "영어" | "탐구";

export type Goal = {
  targetUniversity: string;
  targetScore: number; // 환산 점수 (0-100)
  startScore: number;
  prioritySubjects: Subject[];
  weeklyHours: number; // 기본 40
};

export type WeekPlan = {
  weekNum: number;
  weekStartISO: string; // 그 주 월요일
  label: string; // "4월 3주차"
  totalHours: number;
  subjectHours: Record<Subject, number>;
};

const BASE_RATIO: Record<Subject, number> = {
  국어: 0.25,
  수학: 0.35,
  영어: 0.2,
  탐구: 0.2,
};

function getMonday(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=일
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function weekLabel(d: Date): string {
  const month = d.getMonth() + 1;
  const nthWeek = Math.ceil(d.getDate() / 7);
  return `${month}월 ${nthWeek}주차`;
}

export function generatePlan(
  goal: Goal,
  targetDate: Date,
  today: Date = new Date()
): WeekPlan[] {
  const start = getMonday(today);
  const end = getMonday(targetDate);
  const weeks: WeekPlan[] = [];

  // 우선순위 보정
  const ratio: Record<Subject, number> = { ...BASE_RATIO };
  if (goal.prioritySubjects.length > 0) {
    const boost = 0.05;
    for (const s of goal.prioritySubjects) {
      ratio[s] += boost;
    }
    const sum = Object.values(ratio).reduce((a, b) => a + b, 0);
    (Object.keys(ratio) as Subject[]).forEach((s) => {
      ratio[s] = ratio[s] / sum;
    });
  }

  let weekNum = 1;
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    const subjectHours: Record<Subject, number> = {
      국어: Math.round(goal.weeklyHours * ratio["국어"] * 10) / 10,
      수학: Math.round(goal.weeklyHours * ratio["수학"] * 10) / 10,
      영어: Math.round(goal.weeklyHours * ratio["영어"] * 10) / 10,
      탐구: Math.round(goal.weeklyHours * ratio["탐구"] * 10) / 10,
    };
    weeks.push({
      weekNum: weekNum++,
      weekStartISO: cursor.toISOString(),
      label: weekLabel(cursor),
      totalHours: goal.weeklyHours,
      subjectHours,
    });
    cursor.setDate(cursor.getDate() + 7);
    if (weeks.length > 60) break; // 1년 이상 방어
  }

  return weeks;
}

// 현재 주의 진도 (이번 주 학습 시간 합)
export function progressThisWeek(
  totalSecondsThisWeek: number,
  weeklyTargetHours: number
): number {
  const hours = totalSecondsThisWeek / 3600;
  return Math.min(100, Math.round((hours / weeklyTargetHours) * 100));
}

export const SUBJECT_META: Record<Subject, { tint: string; emoji: string }> = {
  국어: { tint: "var(--cta)", emoji: "📖" },
  수학: { tint: "var(--primary)", emoji: "🔢" },
  영어: { tint: "var(--success)", emoji: "🌍" },
  탐구: { tint: "var(--lavender)", emoji: "🔬" },
};
