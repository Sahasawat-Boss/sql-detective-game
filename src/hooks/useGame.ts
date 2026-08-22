"use client";

import { useCallback, useMemo, useState } from "react";
import { CASES } from "@/data/cases";
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

/** สถานะเกม: คดีที่กำลังเปิดอยู่ และรายการคดีที่ปิดไปแล้ว */
export function useGame(): UseGame {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const submitAnswer = useCallback(
    (input: string) => {
      const correct = matchesAnswer(input, CASES[currentIndex].answers);
      if (correct) {
        setSolved((prev) => new Set(prev).add(currentIndex));
      }
      return correct;
    },
    [currentIndex],
  );

  return useMemo(
    () => ({
      cases: CASES,
      current: CASES[currentIndex],
      currentIndex,
      solved,
      isSolved: solved.has(currentIndex),
      allSolved: solved.size === CASES.length,
      goTo: setCurrentIndex,
      submitAnswer,
    }),
    [currentIndex, solved, submitAnswer],
  );
}
