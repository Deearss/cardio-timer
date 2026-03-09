export type Difficulty = "pemula" | "menengah" | "lanjut";
export type Phase = "idle" | "exercise" | "rest" | "done";

export interface Exercise {
  name: string;
  emoji: string;
  tip: string;
}

export interface Level {
  ratio: number;
  divisor: number;
  label: string;
  note: string;
}

export const EX: Exercise[] = [
  {
    name: "Jumping Jacks",
    emoji: "⭐",
    tip: "Lompat, buka-tutup kaki & tangan!",
  },
  {
    name: "Jump Squats",
    emoji: "🦵",
    tip: "Squat lalu lompat setinggi mungkin!",
  },
  { name: "Burpees", emoji: "💪", tip: "Full body — habis-habisan!" },
  {
    name: "Mountain Climbers",
    emoji: "🧗",
    tip: "Posisi plank, kaki bergantian cepat!",
  },
  {
    name: "Jumping Jacks",
    emoji: "⭐",
    tip: "Finisher! Habiskan semua sisa tenaga!",
  },
];

export const LEVELS: Record<Difficulty, Level> = {
  pemula: {
    ratio: 1.5,
    divisor: 11,
    label: "🟢 Pemula — Rasio kerja:istirahat = 1:1.5",
    note: "Istirahat 1.5× lebih lama dari gerakan — level pemula 🟢",
  },
  menengah: {
    ratio: 1.0,
    divisor: 9,
    label: "🟡 Menengah — Rasio kerja:istirahat = 1:1",
    note: "Istirahat sama lama dengan gerakan — level menengah 🟡",
  },
  lanjut: {
    ratio: 0.5,
    divisor: 7,
    label: "🔴 Lanjut — Rasio kerja:istirahat = 2:1",
    note: "Istirahat setengah dari gerakan — level lanjut 🔴",
  },
};

export const DURATION_OPTIONS = [
  { value: 300, label: "⏱ 5 Menit" },
  { value: 600, label: "⏱ 10 Menit" },
  { value: 900, label: "⏱ 15 Menit" },
  { value: 1200, label: "⏱ 20 Menit" },
  { value: 1800, label: "⏱ 30 Menit" },
  { value: 2700, label: "⏱ 45 Menit" },
  { value: 3600, label: "⏱ 60 Menit" },
];

export const CIRC = 2 * Math.PI * 88; // ≈ 552.92

export function fmt(s: number): string {
  return (
    String(Math.floor(s / 60)).padStart(2, "0") +
    ":" +
    String(s % 60).padStart(2, "0")
  );
}

export function calcDurs(
  totalDur: number,
  diff: Difficulty,
): { ed: number; rd: number } {
  const lv = LEVELS[diff];
  const ed = Math.floor(totalDur / lv.divisor);
  const rd = Math.floor(ed * lv.ratio);
  return { ed, rd };
}
