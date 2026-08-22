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

export default function VerdictCard({ goal, allSolved, resetKey, onSubmit }: Props) {
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<{ tone: MessageTone; text: string } | null>(null);

  useEffect(() => {
    setInput("");
    setVerdict(null);
  }, [resetKey]);

  const handleSubmit = () => {
    if (!input.trim()) {
      setVerdict({ tone: "error", text: "ยังไม่ได้พิมพ์คำตอบ" });
      return;
    }
    const correct = onSubmit(input);
    setVerdict(
      correct
        ? {
            tone: "ok",
            text: `ถูกต้อง — ปิดสำนวนได้${allSolved ? " · ปิดครบทุกคดีแล้ว" : " · ไปคดีต่อไปได้เลย"}`,
          }
        : { tone: "error", text: "ยังไม่ใช่ ลองตรวจเงื่อนไขในคิวรีอีกครั้ง" },
    );
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
          placeholder="พิมพ์คำตอบที่นี่"
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
