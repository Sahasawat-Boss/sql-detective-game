"use client";

import { useEffect, useState } from "react";
import type { DetectiveCase } from "@/types";

/**
 * กล่องเครื่องมือ — เปิดคำใบ้ทีละใบ ไม่เทให้หมดทีเดียว
 * คนที่กด "ขอคำใบ้" ส่วนใหญ่ไม่ได้อยากได้เฉลย แค่อยากได้แรงผลักทีละก้าว
 * ถ้าโยนคำใบ้ที่มีคำสั่งครบให้ตั้งแต่ใบแรก เท่ากับตัดขั้นตอนคิดทิ้งไปเลย
 * ส่วนเฉลยเต็มยังกดดูได้ตลอด แต่ต้องกดเองอีกทีเสมอ
 */
export default function Toolbox({ detectiveCase }: { detectiveCase: DetectiveCase }) {
  const { hints, solution, n } = detectiveCase;
  const [revealed, setRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // เปลี่ยนคดีแล้วเริ่มนับใบคำใบ้ใหม่
  useEffect(() => {
    setRevealed(0);
    setShowSolution(false);
  }, [n]);

  const hasMore = revealed < hints.length;

  return (
    <div className="paper on-paper mt-5">
      <div className="eyebrow">กล่องเครื่องมือ</div>
      <p className="mb-2.5 mt-0 text-[12.5px] leading-relaxed text-ink-soft">
        ติดตรงไหนกดขอคำใบ้ได้เลย ไม่ถือว่าโกง — มีให้ {hints.length} ใบ
        ไล่จากชี้ทางคิดไปจนเกือบเฉลย
      </p>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="btn btn-paper"
          disabled={!hasMore}
          onClick={() => setRevealed((count) => count + 1)}
        >
          {revealed === 0
            ? `ขอคำใบ้ (มี ${hints.length} ใบ)`
            : hasMore
              ? `ขอคำใบ้ใบถัดไป · ${revealed + 1}/${hints.length}`
              : "เปิดคำใบ้ครบแล้ว"}
        </button>

        <button
          type="button"
          className="btn btn-paper"
          onClick={() => setShowSolution((open) => !open)}
        >
          {showSolution ? "ซ่อนเฉลยคิวรี" : "ดูเฉลยคิวรี"}
        </button>
      </div>

      {hints.slice(0, revealed).map((hint, index) => (
        <div
          key={hint}
          className="mt-3 rounded-sm border-l-[3px] border-brass bg-white/30 px-3 py-2.5 text-sm"
        >
          <div className="eyebrow mb-1">
            คำใบ้ {index + 1}/{hints.length}
          </div>
          <div dangerouslySetInnerHTML={{ __html: hint }} />
        </div>
      ))}

      {showSolution && (
        <div className="mt-3 rounded-sm border-l-[3px] border-brass bg-white/30 px-3 py-2.5">
          <div className="eyebrow mb-1">เฉลย</div>
          <pre className="m-0 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed">
            {solution}
          </pre>
          <p className="mb-0 mt-2 text-[12px] text-ink-soft">
            ลอกไปวางในคอนโซลแล้วรันดูได้ — อ่านทีละบรรทัดว่าแต่ละคำสั่งทำอะไร
            แค่นี้ก็ถือว่าผ่านคดีนี้แล้ว
          </p>
        </div>
      )}
    </div>
  );
}
