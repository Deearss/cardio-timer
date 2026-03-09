"use client";

import { Zap, ChevronsUp, Dumbbell, Mountain, BatteryCharging, Trophy, Timer, type LucideIcon } from "lucide-react";
import { CIRC, EX, fmt, type Phase } from "@/lib/constants";

const EX_ICONS: LucideIcon[] = [Zap, ChevronsUp, Dumbbell, Mountain, Zap];

interface TimerRingProps {
  phase: Phase;
  exIdx: number;
  tLeft: number;
  exDur: number;
  restDur: number;
  totDur: number;
  totLeft: number;
  hintText: string;
}

function getRingOffset(tLeft: number, total: number): number {
  if (total <= 0) return CIRC;
  return CIRC * (1 - tLeft / total);
}

export default function TimerRing({
  phase,
  exIdx,
  tLeft,
  exDur,
  restDur,
  totDur,
  totLeft,
  hintText,
}: TimerRingProps) {
  const elapsed = totDur - totLeft;
  const pct =
    totDur > 0 ? Math.min(100, Math.round((elapsed / totDur) * 100)) : 0;

  // Phase badge config
  const badge = (() => {
    if (phase === "exercise")
      return {
        text: `GERAKAN ${exIdx + 1} / ${EX.length}`,
        bg: "rgba(232,104,26,.16)",
        color: "#E8681A",
      };
    if (phase === "rest")
      return { text: "ISTIRAHAT", bg: "#1a1a1a", color: "#6b7280" };
    if (phase === "done")
      return { text: "✅ DONE!", bg: "rgba(34,197,94,.12)", color: "#22c55e" };
    return { text: "SIAP MULAI", bg: "#1a1a1a", color: "#6b7280" };
  })();

  // Ring config
  const ringOffset = (() => {
    if (phase === "exercise") return getRingOffset(tLeft, exDur);
    if (phase === "rest") return getRingOffset(tLeft, restDur);
    if (phase === "done") return getRingOffset(0, 1);
    return CIRC;
  })();
  const isRest = phase === "rest";

  // Center display
  const centerIcon = (() => {
    if (phase === "exercise") {
      const Icon = EX_ICONS[exIdx];
      return { node: <Icon className="size-[1em]" />, cls: "anim-bounce", color: "#E8681A" };
    }
    if (phase === "rest")
      return { node: <BatteryCharging className="size-[1em]" />, cls: "anim-breathe", color: "#6b7280" };
    if (phase === "done")
      return { node: <Trophy className="size-[1em]" />, cls: "anim-cele", color: "#22c55e" };
    return { node: <Timer className="size-[1em]" />, cls: "", color: "#4b5563" };
  })();

  const timerNum = (() => {
    if (phase === "exercise" || phase === "rest") return fmt(tLeft);
    if (phase === "done") return "00:00";
    return "--:--";
  })();

  const timerColor =
    phase === "done" ? "#22c55e" : phase === "rest" ? "#6b7280" : "#E8681A";

  const label = (() => {
    if (phase === "exercise") return { text: EX[exIdx].name, color: "#f97316" };
    if (phase === "rest")
      return {
        text: `Istirahat... lanjut ${EX[exIdx + 1]?.name ?? ""}!`,
        color: "#6b7280",
      };
    if (phase === "done")
      return { text: "Selesai! Kerja bagus! 💪", color: "#22c55e" };
    return { text: "Pilih durasi & mulai", color: "#4b5563" };
  })();

  const cardClass = `rounded-2xl p-5 sm:p-7 ${
    phase === "exercise" ? "anim-ring" : ""
  }`;

  return (
    <div
      className={cardClass}
      style={{
        background: "var(--ct-card)",
        border: "1px solid var(--ct-border)",
      }}
    >
      {/* Phase badge */}
      <div className="text-center mb-3">
        <span
          className="inline-block text-[0.625em] font-extrabold tracking-widest uppercase px-3.5 py-0.5 rounded-full"
          style={{ background: badge.bg, color: badge.color }}
        >
          {badge.text}
        </span>
      </div>

      {/* Ring */}
      <div className="relative flex justify-center items-center">
        <svg
          className="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60"
          viewBox="0 0 204 204"
        >
          <circle
            className="ring-track"
            cx="102"
            cy="102"
            r="88"
            fill="none"
            stroke="#1e1e1e"
            strokeWidth="9"
          />
          <circle
            className={`ring-fill${isRest ? " ring-rest" : ""}`}
            cx="102"
            cy="102"
            r="88"
            fill="none"
            strokeWidth="9"
            strokeDasharray={CIRC}
            strokeDashoffset={ringOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`text-5xl sm:text-6xl lg:text-7xl leading-none ${centerIcon.cls}`}
            style={{ color: centerIcon.color }}
          >
            {centerIcon.node}
          </div>
          <div
            className="text-3xl sm:text-4xl lg:text-[2.8em] font-black tabular-nums mt-1.5 leading-none"
            style={{ color: timerColor }}
          >
            {timerNum}
          </div>
        </div>
      </div>

      {/* Hint */}
      <div
        className="text-[0.8em] sm:text-[0.85em] font-semibold text-center px-6 mt-1.5"
        style={{ color: label.color }}
      >
        {label.text}
      </div>
      <p
        className="text-center text-[0.7em] font-medium mt-1.5"
        style={{ color: "#333" }}
      >
        {hintText}
      </p>

      {/* Progress */}
      <div className="mt-4">
        <div
          className="flex justify-between text-[0.625em] font-bold uppercase tracking-wide mb-1.5"
          style={{ color: "#4b5563" }}
        >
          <span>Total Progress</span>
          <span>{pct}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "#1a1a1a" }}
        >
          <div className="prog-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div
          className="flex justify-between text-[0.625em] mt-1"
          style={{ color: "#374151" }}
        >
          <span>{fmt(elapsed)} berlalu</span>
          <span>
            {totLeft > 0
              ? `${fmt(totLeft)} tersisa`
              : phase === "done"
                ? "Selesai! 🎉"
                : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
