"use client";

import { useEffect, useState } from "react";
import Message from "./Message";
import type { MessageTone } from "@/types";

interface Props {
  goal: string;
  allSolved: boolean;
  resetKey: number;
  onSubmit: (input: string) => boolean;
}

/** ตอบผิดกี่ครั้งถึงจะเริ่มชวนไปเปิดคำใบ้ — เดาสองครั้งแรกยังสนุกอยู่ */
const NUDGE_AFTER = 2;

export default function VerdictCard({ goal, allSolved, resetKey, onSubmit }: Props) {
  const [input, setInput] = useState("");
  const [misses, setMisses] = useState(0);
  const [verdict, setVerdict] = useState<{ tone: MessageTone; text: string } | null>(null);

  useEffect(() => {
    setInput("");
    setMisses(0);
    setVerdict(null);
  }, [resetKey]);

  const handleSubmit = () => {
    const answer = input.trim();
    if (!answer) {
      setVerdict({ tone: "error", text: "ยังไม่ได้พิมพ์คำตอบ" });
      return;
    }
    // มือใหม่มักเผลอวางคิวรีลงช่องนี้แทนที่จะเป็นคอนโซล บอกให้ชัดดีกว่าตอบว่า "ผิด"
    if (/\bselect\b/i.test(answer)) {
      setVerdict({
        tone: "error",
        text: "ช่องนี้ใช้ตอบ “ผลลัพธ์” ที่ได้จากคิวรี (ชื่อคน ชื่อสถานที่ หรือตัวเลข) ส่วนคิวรีให้พิมพ์ในคอนโซลสีดำด้านบนแล้วกดรัน",
      });
      return;
    }

    if (onSubmit(answer)) {
      setVerdict({
        tone: "ok",
        text: `ถูกต้อง — ปิดสำนวนได้${allSolved ? " · ปิดครบทุกคดีแล้ว" : " · กดแท็บคดีถัดไปด้านบนได้เลย"}`,
      });
      return;
    }

    const nextMisses = misses + 1;
    setMisses(nextMisses);
    setVerdict({
      tone: "error",
      text:
        nextMisses >= NUDGE_AFTER
          ? "ยังไม่ใช่ — ลองกด “ขอคำใบ้” ในกล่องเครื่องมือทางขวาดู มีคำใบ้ไล่ทีละขั้นให้ · ถ้าเป็นชื่อคน พิมพ์ชื่อเล่นอย่างเดียวก็ได้"
          : "ยังไม่ใช่ ลองตรวจเงื่อนไขในคิวรีอีกครั้ง",
    });
  };

  return (
    <section className="paper on-paper mt-5">
      <div className="eyebrow">สรุปสำนวน</div>
      <div className="font-semibold">{goal}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="พิมพ์คำตอบที่นี่ (ไม่ใช่คิวรี)"
          aria-label="คำตอบของคดีนี้"
          className="min-w-[190px] flex-1 rounded-t-sm border-0 border-b-2 border-ink-soft bg-white/25 px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-[#8d7a5e] focus:border-stamp focus:bg-white/45"
        />
        <button type="button" className="btn" onClick={handleSubmit}>
          ยืนยันคำตอบ
        </button>
      </div>

      {verdict && <Message tone={verdict.tone}>{verdict.text}</Message>}
    </section>
  );
}
