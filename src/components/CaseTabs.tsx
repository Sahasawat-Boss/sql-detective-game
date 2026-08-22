"use client";

import type { DetectiveCase } from "@/types";

export default function CaseTabs({
  cases,
  currentIndex,
  solved,
  onSelect,
}: {
  cases: DetectiveCase[];
  currentIndex: number;
  solved: Set<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <nav className="relative z-10 flex flex-wrap gap-[3px] pl-2" aria-label="รายการคดี">
      {cases.map((c, i) => (
        <button
          key={c.n}
          type="button"
          className="folder-tab"
          data-active={i === currentIndex}
          data-solved={solved.has(i)}
          aria-current={i === currentIndex}
          title={`${c.title} · ${c.level}`}
          onClick={() => onSelect(i)}
        >
          {c.tutorial ? "ฝึก" : "คดี"} {c.n}
          {solved.has(i) && " ✓"}
        </button>
      ))}
    </nav>
  );
}
