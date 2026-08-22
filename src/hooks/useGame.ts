"use client";

import { useCallback, useMemo, useState } from "react";
import { matchesAnswer } from "@/lib/normalize";
import type { DetectiveCase } from "@/types";

interface UseGame {
  cases: DetectiveCase[];
  current: DetectiveCase;
  currentIndex: number;
  solved: Set<number>;
  isSolved: boolean;
  allSolved: boolean;
  goTo: (index: number) => void;
  submitAnswer: (input: string) => boolean;
}

/** สถานะเกม: คดีที่กำลังเปิดอยู่ และรายการคดีที่ปิดไปแล้ว — cases มาจากรอบเล่นปัจจุบัน (ชื่อสุ่มใหม่ทุกรอบ) */
export function useGame(cases: DetectiveCase[]): UseGame {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const submitAnswer = useCallback(
    (input: string) => {
      const correct = matchesAnswer(input, cases[currentIndex].answers);
      if (correct) {
        setSolved((prev) => new Set(prev).add(currentIndex));
      }
      return correct;
    },
    [cases, currentIndex],
  );

  return useMemo(
    () => ({
      cases,
      current: cases[currentIndex],
      currentIndex,
      solved,
      isSolved: solved.has(currentIndex),
      allSolved: solved.size === cases.length,
      goTo: setCurrentIndex,
      submitAnswer,
    }),
    [cases, currentIndex, solved, submitAnswer],
  );
}
