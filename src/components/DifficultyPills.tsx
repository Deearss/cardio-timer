"use client";

import { LEVELS, type Difficulty, type Phase } from "@/lib/constants";

interface DifficultyPillsProps {
  diff: Difficulty;
  phase: Phase;
  onSelect: (d: Difficulty) => void;
}

const PILLS: { key: Difficulty; label: string; sub: string }[] = [
  { key: "pemula", label: "🟢 Pemula", sub: "Kerja 1× · Istirahat 1.5×" },
  { key: "menengah", label: "🟡 Menengah", sub: "Kerja 1× · Istirahat 1×" },
  { key: "lanjut", label: "🔴 Lanjut", sub: "Kerja 2× · Istirahat 1×" },
];

const ACTIVE_STYLES: Record<Difficulty, React.CSSProperties> = {
  pemula: {
    borderColor: "#E8681A",
    background: "rgba(232,104,26,.12)",
    color: "#E8681A",
  },
  menengah: {
    borderColor: "#f59e0b",
    background: "rgba(245,158,11,.1)",
    color: "#f59e0b",
  },
  lanjut: {
    borderColor: "#ef4444",
    background: "rgba(239,68,68,.1)",
    color: "#ef4444",
  },
};

export default function DifficultyPills({
  diff,
  phase,
  onSelect,
}: DifficultyPillsProps) {
  const disabled = phase !== "idle";

  return (
    <div>
      <label
        className="block text-[0.625em] font-bold uppercase tracking-widest mb-1.5"
        style={{ color: "#6b7280" }}
      >
        💪 Level Kesulitan
      </label>
      <div className="flex gap-2">
        {PILLS.map(({ key, label }) => {
          const isActive = diff === key;
          const style: React.CSSProperties = isActive
            ? ACTIVE_STYLES[key]
            : { borderColor: "#232323", background: "#111", color: "#6b7280" };

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              disabled={disabled}
              className="flex-1 px-2 py-2.5 rounded-xl text-[0.65em] sm:text-[0.8em] font-bold text-center leading-snug transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1.5px solid", ...style }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center items-center">
        <span
          className="inline-block text-[0.625em] font-bold px-3 py-1 rounded-full"
          style={{ background: "#1a1a1a", color: "#4b5563" }}
        >
          {LEVELS[diff].label}
        </span>
      </div>
    </div>
  );
}
