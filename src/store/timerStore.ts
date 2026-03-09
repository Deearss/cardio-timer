import { create } from "zustand";
import { EX, calcDurs, type Difficulty, type Phase } from "@/lib/constants";

interface TimerState {
  phase: Phase;
  exIdx: number;
  tLeft: number;
  totLeft: number;
  totDur: number;
  exDur: number;
  restDur: number;
  isPaused: boolean;
  diff: Difficulty;
  selectedDuration: number;
}

interface TimerActions {
  setDiff: (d: Difficulty) => void;
  setSelectedDuration: (d: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  phase: "idle",
  exIdx: 0,
  tLeft: 0,
  totLeft: 0,
  totDur: 0,
  exDur: 0,
  restDur: 0,
  isPaused: false,
  diff: "pemula",
  selectedDuration: 300,

  setDiff: (d) => {
    if (get().phase !== "idle") return;
    set({ diff: d });
  },

  setSelectedDuration: (d) => {
    if (get().phase !== "idle") return;
    set({ selectedDuration: d });
  },

  start: () => {
    const { phase, selectedDuration, diff } = get();
    if (phase === "idle" || phase === "done") {
      const { ed, rd } = calcDurs(selectedDuration, diff);
      set({
        totDur: selectedDuration,
        exDur: ed,
        restDur: rd,
        totLeft: selectedDuration,
        exIdx: 0,
        phase: "exercise",
        tLeft: ed,
        isPaused: false,
      });
    }
  },

  pause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  reset: () => {
    set({
      phase: "idle",
      exIdx: 0,
      tLeft: 0,
      totLeft: 0,
      totDur: 0,
      exDur: 0,
      restDur: 0,
      isPaused: false,
    });
  },

  tick: () => {
    const { tLeft, totLeft, phase, exIdx, exDur, restDur } = get();
    const newTLeft = tLeft - 1;
    const newTotLeft = Math.max(0, totLeft - 1);

    if (newTLeft <= 0) {
      if (phase === "exercise") {
        if (exIdx < EX.length - 1) {
          set({ tLeft: restDur, totLeft: newTotLeft, phase: "rest" });
        } else {
          set({ tLeft: 0, totLeft: 0, phase: "done" });
        }
        return;
      } else if (phase === "rest") {
        set({
          tLeft: exDur,
          totLeft: newTotLeft,
          phase: "exercise",
          exIdx: exIdx + 1,
        });
        return;
      }
    }

    set({ tLeft: newTLeft, totLeft: newTotLeft });
  },
}));
