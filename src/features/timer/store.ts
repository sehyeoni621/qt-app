import { create } from "zustand";
import type { Subject } from "@/features/home/mockData";

export type Mode = "picker" | "focus" | "result";

type TimerOptions = {
  antiCheat: boolean; // 부측 방지 팝업
  whiteNoise: boolean;
  muteNotifs: boolean;
};

type TimerState = {
  mode: Mode;
  subject: Subject | null;
  seconds: number;
  paused: boolean;
  correct: number;
  wrong: number;
  focus: number; // 1~5
  checkOpen: boolean; // 부측 팝업 오픈
  lastCheckAt: number; // 초 단위
  options: TimerOptions;

  // actions
  start: (subject: Subject) => void;
  pause: () => void;
  resume: () => void;
  tick: () => void;
  bumpCorrect: () => void;
  bumpWrong: () => void;
  setFocus: (v: number) => void;
  openCheck: () => void;
  answerCheck: (focused: boolean) => void;
  end: () => void;
  goPicker: () => void;
  setOption: (k: keyof TimerOptions, v: boolean) => void;
};

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: "picker",
  subject: null,
  seconds: 0,
  paused: false,
  correct: 0,
  wrong: 0,
  focus: 4,
  checkOpen: false,
  lastCheckAt: 0,
  options: { antiCheat: true, whiteNoise: false, muteNotifs: true },

  start: (subject) =>
    set({
      mode: "focus",
      subject,
      seconds: 0,
      paused: false,
      correct: 0,
      wrong: 0,
      focus: 4,
      checkOpen: false,
      lastCheckAt: 0,
    }),
  pause: () => set({ paused: true }),
  resume: () => set({ paused: false }),
  tick: () => {
    const s = get();
    if (s.mode !== "focus" || s.paused || s.checkOpen) return;
    const next = s.seconds + 1;
    const patch: Partial<TimerState> = { seconds: next };
    // 부측 방지 팝업: 옵션 ON이고 30초마다 오픈
    if (s.options.antiCheat && next - s.lastCheckAt >= 30 && next > 0) {
      patch.checkOpen = true;
      patch.lastCheckAt = next;
    }
    set(patch);
  },
  bumpCorrect: () => set((s) => ({ correct: s.correct + 1 })),
  bumpWrong: () => set((s) => ({ wrong: s.wrong + 1 })),
  setFocus: (v) => set({ focus: Math.max(1, Math.min(5, v)) }),
  openCheck: () => set({ checkOpen: true }),
  answerCheck: (focused) =>
    set((s) => ({
      checkOpen: false,
      focus: Math.max(1, Math.min(5, s.focus + (focused ? 0 : -1))),
    })),
  end: () => set({ mode: "result", paused: true, checkOpen: false }),
  goPicker: () =>
    set({
      mode: "picker",
      subject: null,
      seconds: 0,
      paused: false,
      correct: 0,
      wrong: 0,
      focus: 4,
      checkOpen: false,
      lastCheckAt: 0,
    }),
  setOption: (k, v) =>
    set((s) => ({ options: { ...s.options, [k]: v } })),
}));
