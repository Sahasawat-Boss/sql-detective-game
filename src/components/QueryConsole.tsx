"use client";

import { useEffect, useRef, useState } from "react";
import type { Database } from "sql.js";
import { runQuery } from "@/hooks/useDatabase";
import { checkReadOnly } from "@/lib/sqlGuard";
import type { MessageTone, QueryResult } from "@/types";
import Message from "./Message";
import ResultTable from "./ResultTable";

interface Props {
  db: Database | null;
  /** ข้อความเริ่มต้นในช่องผลลัพธ์ เปลี่ยนตามคดี */
  placeholderNote: string;
  /** รีเซ็ตช่องเขียนเมื่อค่านี้เปลี่ยน (ใช้เลขคดี) */
  resetKey: number;
  /**
   * คำขอวางคิวรีจากสมุดบันทึก — ต้องเป็น object ใหม่ทุกครั้งที่กด
   * แม้จะเป็นคิวรีเดิม เพื่อให้ effect ทำงานซ้ำได้
   */
  insertRequest: { sql: string } | null;
  /** เก็บคิวรีที่เขียนค้างอยู่ลงสมุดบันทึก */
  onSaveQuery: (sql: string) => void;
}

export default function QueryConsole({
  db,
  placeholderNote,
  resetKey,
  insertRequest,
  onSaveQuery,
}: Props) {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [note, setNote] = useState<{ tone: MessageTone; text: string }>({
    tone: "info",
    text: placeholderNote,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ล้างช่องเขียนเฉพาะตอนเปลี่ยนคดี — ไม่ผูกกับ placeholderNote
  // ซึ่งเปลี่ยนตอนโหลดฐานข้อมูลเสร็จด้วย และจะลบสิ่งที่ผู้เล่นพิมพ์ค้างไว้ทิ้ง
  useEffect(() => {
    setSql("");
    setResult(null);
    textareaRef.current?.focus();
  }, [resetKey]);

  useEffect(() => {
    setNote({ tone: "info", text: placeholderNote });
  }, [placeholderNote]);

  useEffect(() => {
    if (!insertRequest) return;
    setSql(insertRequest.sql);
    setNote({ tone: "info", text: "วางคิวรีจากสมุดบันทึกแล้ว" });
    textareaRef.current?.focus();
  }, [insertRequest]);

  const handleRun = () => {
    if (!db) return;
    const guard = checkReadOnly(sql);
    if (guard) {
      setResult(null);
      setNote({ tone: "error", text: guard });
      return;
    }
    try {
      const res = runQuery(db, sql);
      if (!res) {
        setResult(null);
        setNote({ tone: "info", text: "คิวรีรันผ่าน แต่ไม่มีแถวที่ตรงเงื่อนไข ลองผ่อนเงื่อนไขดู" });
        return;
      }
      setResult(res);
      setNote({ tone: "ok", text: `${res.values.length} แถว` });
    } catch (e) {
      setResult(null);
      setNote({ tone: "error", text: `คิวรีไม่ผ่าน: ${e instanceof Error ? e.message : String(e)}` });
    }
  };

  return (
    <section className="console-shell">
      <div className="console-bar">
        <i className="console-dot" data-live="true" />
        <i className="console-dot" />
        <i className="console-dot" />
        <span className="ml-1 font-mono text-[11px] uppercase tracking-[2px] text-[#9B8560]">
          query console — sqlite
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={sql}
        spellCheck={false}
        onChange={(e) => setSql(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRun();
        }}
        placeholder="SELECT * FROM people;"
        aria-label="ช่องเขียนคิวรี SQL"
        className="block min-h-[150px] w-full resize-y border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 text-term-fg outline-none placeholder:text-[#6d5c3e] focus:bg-white/5"
      />

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-[#0F0B06] px-3.5 py-3">
        <button type="button" className="btn" onClick={handleRun} disabled={!db}>
          รันคิวรี
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setSql("");
            textareaRef.current?.focus();
          }}
        >
          ล้าง
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!sql.trim()}
          onClick={() => {
            onSaveQuery(sql);
            setNote({ tone: "ok", text: "เก็บคิวรีลงสมุดบันทึกแล้ว — เปิดอ่านได้ทุกด่าน" });
          }}
        >
          📌 เก็บคิวรี
        </button>
        <span className="ml-auto font-mono text-[11px] text-[#7d6b4c]">Ctrl + Enter</span>
      </div>

      <div className="bg-[#0F0B06] px-3.5 pb-3.5">
        {result && <ResultTable result={result} />}
        <Message tone={note.tone}>{note.text}</Message>
      </div>
    </section>
  );
}
