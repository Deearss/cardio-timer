"use client";

import { useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/store/timerStore";
import {
  DURATION_OPTIONS,
  LEVELS,
  calcDurs,
  fmt,
  type Difficulty,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import TimerRing from "@/components/TimerRing";
import ExerciseList from "@/components/ExerciseList";
import DifficultyPills from "@/components/DifficultyPills";

export default function CardioTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevPhaseRef = useRef<string>("idle");

  const {
    phase,
    exIdx,
    tLeft,
    totLeft,
    totDur,
    exDur,
    restDur,
    isPaused,
    diff,
    selectedDuration,
    setDiff,
    setSelectedDuration,
    start,
    pause,
    reset,
  } = useTimerStore();

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      lastTickRef.current = Date.now();
      useTimerStore.getState().tick();
    }, 1000);
  }, []);

  const go = useCallback(
    (firstDelay: number = 1000) => {
      stop();
      if (firstDelay < 1000) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          lastTickRef.current = Date.now();
          useTimerStore.getState().tick();
          startInterval();
        }, firstDelay);
      } else {
        startInterval();
      }
    },
    [stop, startInterval],
  );

  // Stop interval when done
  useEffect(() => {
    if (phase === "done") stop();
  }, [phase, stop]);

  // Init audio
  useEffect(() => {
    audioRef.current = new Audio("/sounds/bong.mp3");
    tickAudioRef.current = new Audio("/sounds/timer-fixed_cutted.mp3");
    tickAudioRef.current.loop = true;
  }, []);

  // Play sound on phase transition to exercise or rest
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      if (phase === "exercise" || phase === "rest") {
        audioRef.current?.play().catch(() => {});
      }
      prevPhaseRef.current = phase;
    }
  }, [phase]);

  // Play/pause ticking sound while timer is running
  useEffect(() => {
    const tick = tickAudioRef.current;
    if (!tick) return;
    const isRunning = (phase === "exercise" || phase === "rest") && !isPaused;
    if (isRunning) {
      tick.play().catch(() => {});
    } else {
      tick.pause();
      tick.currentTime = 0;
    }
  }, [phase, isPaused]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  // Start / Resume / Pause
  const handleStart = useCallback(() => {
    start();
    lastTickRef.current = Date.now();
    go(1000);
  }, [start, go]);

  const handlePause = useCallback(() => {
    if (!isPaused) {
      elapsedRef.current = Date.now() - lastTickRef.current;
      stop();
    } else {
      go(1000 - elapsedRef.current);
    }
    pause();
  }, [isPaused, stop, go, pause]);

  // Spacebar shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || (e.target as HTMLElement).tagName === "BUTTON")
        return;
      e.preventDefault();
      if (phase === "idle" || phase === "done") handleStart();
      else handlePause();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, handleStart, handlePause]);

  const handleReset = () => {
    stop();
    reset();
  };

  // Hint text for the ring
  const hintText = (() => {
    if (phase !== "idle") {
      return `Gerakan: ${fmt(exDur)} · Istirahat: ${fmt(restDur)} · ${LEVELS[diff].label.split("—")[0].trim()}`;
    }
    const { ed, rd } = calcDurs(selectedDuration, diff);
    return ed > 0
      ? `Gerakan: ${fmt(ed)} · Istirahat: ${fmt(rd)}`
      : "Durasi per gerakan akan tampil di sini";
  })();

  // ExerciseList needs computed durations when idle
  const displayExDur =
    phase !== "idle" ? exDur : calcDurs(selectedDuration, diff).ed;
  const displayRestDur =
    phase !== "idle" ? restDur : calcDurs(selectedDuration, diff).rd;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1"
          style={{ color: "var(--or)" }}
        >
          CARDIO TIMER
        </h1>
        <p
          className="text-xs sm:text-sm font-medium"
          style={{ color: "#4b5563" }}
        >
          5 gerakan cardio otomatis — push yourself!
        </p>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-sm sm:max-w-none mx-auto mb-6">
        {/* Duration */}
        <div className="sm:flex-1">
          <label
            className="block text-[0.625em] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: "#6b7280" }}
          >
            ⏱ Durasi Latihan
          </label>
          <div className="relative">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              disabled={phase !== "idle"}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold appearance-none outline-none cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#111",
                border: "1px solid #232323",
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ background: "#111" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#4b5563" }}
            >
              ▾
            </span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="sm:flex-1">
          <DifficultyPills
            diff={diff}
            phase={phase}
            onSelect={(d: Difficulty) => setDiff(d)}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-start">
        {/* Left — Timer */}
        <div className="lg:w-95 shrink-0">
          <TimerRing
            phase={phase}
            exIdx={exIdx}
            tLeft={tLeft}
            exDur={exDur}
            restDur={restDur}
            totDur={totDur}
            totLeft={totLeft}
            hintText={hintText}
          />

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            {/* Start / Repeat button */}
            {phase !== "exercise" && phase !== "rest" ? (
              <Button
                onClick={handleStart}
                className="flex-1 flex justify-center items-center h-12 rounded-xl font-bold text-sm transition-all duration-150 hover:brightness-110 hover:scale-[1.05] active:scale-[0.95] antialiased"
                style={{
                  background: "linear-gradient(135deg, var(--or), var(--or2))",
                  color: "#fff",
                  border: "none",
                }}
              >
                {phase === "done" ? (
                  <>
                    <RotateCcw size="1em" className="inline mr-1.5" />
                    <span>Ulangi</span>
                  </>
                ) : (
                  <>
                    <Play size="1em" className="inline mr-1.5" />
                    <span>Mulai</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStart}
                disabled
                className="flex-1 flex justify-center items-center h-12 rounded-xl font-bold text-sm"
                style={{
                  background: "#1a1a1a",
                  color: "#374151",
                  border: "none",
                  cursor: "not-allowed",
                }}
              >
                <>
                  <Play size="1em" className="inline mr-1.5" />
                  <span>Mulai</span>
                </>
              </Button>
            )}

            {/* Pause / Resume button */}
            <Button
              onClick={handlePause}
              disabled={phase !== "exercise" && phase !== "rest"}
              className="flex-1 flex justify-center items-center h-12 rounded-xl font-bold text-sm transition-all duration-150 hover:brightness-125 hover:scale-[1.05] active:scale-[0.95] antialiased disabled:hover:brightness-100 disabled:hover:scale-100"
              style={
                (phase === "exercise" || phase === "rest") && isPaused
                  ? {
                      background:
                        "linear-gradient(135deg, var(--or), var(--or2))",
                      color: "#fff",
                      border: "none",
                    }
                  : {
                      background: "#131313",
                      color: "#9ca3af",
                      border: "1px solid #222",
                    }
              }
            >
              {isPaused ? (
                <>
                  <Play size="1em" className="inline mr-1.5" />
                  <span>Lanjut</span>
                </>
              ) : (
                <>
                  <Pause size="1em" className="inline mr-1.5" />
                  <span>Jeda</span>
                </>
              )}
            </Button>

            {/* Reset button */}
            <Button
              onClick={handleReset}
              className="h-12 px-4 rounded-xl font-bold text-sm transition-all duration-150 hover:brightness-150 hover:scale-[1.05] active:scale-[0.95]"
              style={{
                background: "#131313",
                color: "#9ca3af",
                border: "1px solid #222",
              }}
            >
              <RotateCcw size="1em" />
            </Button>
          </div>

          <p
            className="text-[0.625em] text-center mt-2.5"
            style={{ color: "#2a2a2a" }}
          >
            {LEVELS[diff].note}
          </p>
        </div>

        {/* Right — Exercise List */}
        <div className="flex-1">
          <ExerciseList
            phase={phase}
            exIdx={exIdx}
            exDur={displayExDur}
            restDur={displayRestDur}
          />
        </div>
      </div>
    </div>
  );
}
