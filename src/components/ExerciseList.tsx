"use client";

import {
  ListOrdered,
  Clock,
  Flag,
  Moon,
  CheckCircle2,
  Flame,
  Minus,
  Zap,
  ChevronsUp,
  Dumbbell,
  Mountain,
  type LucideIcon,
} from "lucide-react";

const EX_ICONS: LucideIcon[] = [Zap, ChevronsUp, Dumbbell, Mountain, Flame];
import { EX, fmt, type Phase } from "@/lib/constants";

interface ExerciseListProps {
  phase: Phase;
  exIdx: number;
  exDur: number;
  restDur: number;
}

export default function ExerciseList({
  phase,
  exIdx,
  exDur,
  restDur,
}: ExerciseListProps) {
  return (
    <div>
      <p
        className="flex items-center gap-1.5 text-[0.625em] font-bold uppercase tracking-widest mb-3"
        style={{ color: "#444" }}
      >
        <ListOrdered size="1.2em" />
        Urutan Gerakan
      </p>
      <div className="flex flex-col gap-2 lg:gap-3">
        {EX.map((ex, i) => {
          const isDone = phase === "done" || i < exIdx;
          const isActive = i === exIdx && phase !== "idle" && phase !== "done";
          const isResting = isActive && phase === "rest";
          const isLast = i === EX.length - 1;
          const durInfo = (
            <span className="flex items-center gap-1">
              <Clock size="0.9em" className="shrink-0" />
              {fmt(exDur)} gerakan
              <span className="mx-0.5">-</span>
              {isLast ? (
                <>
                  <Flag size="0.9em" className="shrink-0 ml-0.5" /> Selesai!
                </>
              ) : (
                <>
                  <Moon size="0.9em" className="shrink-0 ml-0.5" />
                  {"  "}
                  {fmt(restDur)} istirahat
                </>
              )}
            </span>
          );
          const statusIcon = isDone ? (
            <CheckCircle2 size="1em" />
          ) : isActive ? (
            isResting ? (
              <Moon size="1em" />
            ) : (
              <Flame size="1em" />
            )
          ) : (
            <Minus size="1em" />
          );

          const cardStyle: React.CSSProperties = isDone
            ? {
                background: "#0c0c0c",
                border: "1px solid var(--ct-border)",
                opacity: 0.4,
              }
            : isActive
              ? {
                  background: "rgba(232,104,26,.09)",
                  border: "1.5px solid var(--or)",
                  boxShadow: "0 0 22px rgba(232,104,26,.22)",
                }
              : { background: "#111", border: "1px solid var(--ct-border2)" };

          return (
            <div
              key={i}
              className="flex items-center gap-3.5 sm:gap-5 p-3 sm:p-4 rounded-xl transition-all duration-300"
              style={cardStyle}
            >
              {(() => {
                const Icon = EX_ICONS[i];
                return (
                  <Icon
                    // size="2.3em"
                    className="shrink-0 size-[1.7em] sm:size-[2.2em]"
                    style={{
                      color: isActive
                        ? "var(--or)"
                        : isDone
                          ? "#333"
                          : "#4b5563",
                    }}
                  />
                );
              })()}

              {/* Exercise Details */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <p
                  className="font-semibold text-xs sm:text-sm"
                  style={{ color: "#d1d5db" }}
                >
                  {ex.name}
                </p>
                <p
                  className="text-[0.625em] sm:text-xs"
                  style={{ color: "#4b5563" }}
                >
                  {ex.tip}
                </p>
                <div
                  className="text-[0.625em] sm:text-xs font-semibold mt-0.5 transition-colors duration-300"
                  style={{
                    color: isDone
                      ? "#1a1a1a"
                      : isActive
                        ? "var(--or)"
                        : "#3a3a3a",
                  }}
                >
                  {durInfo}
                </div>
              </div>

              {/* Status Icon */}
              <span
                className="text-lg sm:text-2xl font-bold shrink-0"
                style={{
                  color: isDone
                    ? "#22c55e"
                    : isActive
                      ? "var(--or)"
                      : "#2e2e2e",
                }}
              >
                {statusIcon}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
