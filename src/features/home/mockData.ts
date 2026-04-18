export type Subject = "국어" | "수학" | "영어" | "탐구";

export type Todo = {
  id: string;
  text: string;
  subject: Subject;
  minutes: number;
  done: boolean;
};

export const initialTodos: Todo[] = [
  {
    id: "t1",
    text: "수능특강 수학 3단원 20문제",
    subject: "수학",
    minutes: 90,
    done: false,
  },
  {
    id: "t2",
    text: "김상훈 문학 필기노트 정리",
    subject: "국어",
    minutes: 60,
    done: true,
  },
  {
    id: "t3",
    text: "영어 단어장 Day 14 암기",
    subject: "영어",
    minutes: 30,
    done: false,
  },
  {
    id: "t4",
    text: "생명과학 광합성 단원 오답 복습",
    subject: "탐구",
    minutes: 45,
    done: false,
  },
];

export const SUBJECT_TINT: Record<Subject, string> = {
  국어: "var(--cta)",
  수학: "var(--primary)",
  영어: "var(--success)",
  탐구: "var(--lavender)",
};

// 최근 7일 QI (오늘이 마지막)
export const weeklyQi: { day: string; qi: number }[] = [
  { day: "월", qi: 54 },
  { day: "화", qi: 58 },
  { day: "수", qi: 62 },
  { day: "목", qi: 50 },
  { day: "금", qi: 70 },
  { day: "토", qi: 65 },
  { day: "오늘", qi: 72 },
];

export const qiBreakdown = {
  time: 85, // 학습시간 (0-100)
  solves: 68, // 풀이수
  accuracy: 72, // 정답률
};

export const todayQi = 72;

// 수능: 항상 11월 셋째 목요일. 2026년은 11/19.
export const SUNEUNG_DATE = new Date("2026-11-19T00:00:00+09:00");

export const MOOD_EMOJIS = [
  { level: 1, emoji: "😫", label: "많이 힘듦" },
  { level: 2, emoji: "😔", label: "우울" },
  { level: 3, emoji: "😐", label: "보통" },
  { level: 4, emoji: "🙂", label: "좋음" },
  { level: 5, emoji: "😊", label: "최고" },
] as const;

export type MoodLevel = (typeof MOOD_EMOJIS)[number]["level"];
