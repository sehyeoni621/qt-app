export type ExamListItem = {
  id: string;
  year: number;
  round: string; // "9월" · "6월" · "수능" · "학평"
  subject: "국어" | "수학" | "영어" | "과탐" | "사탐";
  timeMin: number;
  items: number;
  badge?: "AI" | "NEW";
};

export const EXAM_LIST: ExamListItem[] = [
  {
    id: "e1",
    year: 2025,
    round: "9월 평가원",
    subject: "수학",
    timeMin: 100,
    items: 30,
    badge: "AI",
  },
  {
    id: "e2",
    year: 2025,
    round: "6월 평가원",
    subject: "국어",
    timeMin: 80,
    items: 45,
    badge: "NEW",
  },
  {
    id: "e3",
    year: 2024,
    round: "수능",
    subject: "영어",
    timeMin: 70,
    items: 45,
  },
  {
    id: "e4",
    year: 2024,
    round: "9월 평가원",
    subject: "과탐",
    timeMin: 30,
    items: 20,
  },
  {
    id: "e5",
    year: 2024,
    round: "6월 평가원",
    subject: "수학",
    timeMin: 100,
    items: 30,
  },
];

export type ExamRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  subject: string;
  score: number; // 원점수
  grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  delta: number; // 이전 대비
};

export const EXAM_RECORDS: ExamRecord[] = [
  {
    id: "r1",
    date: "2026-04-12",
    title: "2025 9월 평가원",
    subject: "수학",
    score: 88,
    grade: 2,
    delta: 5,
  },
  {
    id: "r2",
    date: "2026-04-05",
    title: "2025 6월 평가원",
    subject: "국어",
    score: 82,
    grade: 3,
    delta: -2,
  },
  {
    id: "r3",
    date: "2026-03-29",
    title: "2024 수능",
    subject: "영어",
    score: 91,
    grade: 1,
    delta: 3,
  },
  {
    id: "r4",
    date: "2026-03-22",
    title: "2024 9월 평가원",
    subject: "수학",
    score: 83,
    grade: 3,
    delta: 6,
  },
];

export const WEEKLY_AVG: { week: string; avg: number }[] = [
  { week: "W1", avg: 72 },
  { week: "W2", avg: 75 },
  { week: "W3", avg: 78 },
  { week: "W4", avg: 74 },
  { week: "W5", avg: 82 },
  { week: "W6", avg: 86 },
];

export const GRADE_TINT: Record<number, string> = {
  1: "var(--gold)",
  2: "var(--cta)",
  3: "var(--primary)",
  4: "var(--text-mid)",
  5: "var(--text-light)",
  6: "var(--text-light)",
  7: "var(--danger)",
  8: "var(--danger)",
  9: "var(--danger)",
};
