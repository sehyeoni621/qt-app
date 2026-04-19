// QI (Quality Index) 계산 — 추후 서버 이관을 위해 격리
// 공식 (기획서 기반):
// QI = (시간/3600 * 14) + (정답률 * 0.35) + (집중도 * 7) + (풀이수 * 0.7)
// 상한 120, 하한 0으로 clamp

export type QISession = {
  seconds: number; // 실제 학습 시간(초)
  correct: number;
  wrong: number;
  focus: number; // 1~5 (집중도 도트)
};

export type QIBreakdown = {
  time: number; // 시간 기여도
  accuracy: number; // 정답률 기여도
  focus: number; // 집중도 기여도
  solves: number; // 풀이수 기여도
  total: number; // 합산 QI
  accuracyRate: number; // 0~100
};

export function computeQI(s: QISession): QIBreakdown {
  const problems = s.correct + s.wrong;
  const accuracyRate =
    problems === 0 ? 0 : Math.round((s.correct / problems) * 100);

  const time = (s.seconds / 3600) * 14;
  const accuracy = accuracyRate * 0.35;
  const focus = s.focus * 7;
  const solves = problems * 0.7;

  const raw = time + accuracy + focus + solves;
  const total = Math.max(0, Math.min(120, Math.round(raw)));

  return {
    time: Math.round(time),
    accuracy: Math.round(accuracy),
    focus: Math.round(focus),
    solves: Math.round(solves),
    total,
    accuracyRate,
  };
}

export function formatHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
