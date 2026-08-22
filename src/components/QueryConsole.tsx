"use client";

import { useEffect, useRef, useState } from "react";
import type { Database } from "sql.js";
import { runQuery } from "@/hooks/useDatabase";
import { explainSqlError } from "@/lib/sqlError";
import { checkReadOnly } from "@/lib/sqlGuard";
import type { MessageTone, QueryResult } from "@/types";
import Message from "./Message";
import ResultTable from "./ResultTable";

interface Props {
  db: Database | null;
  /** ข้อความเริ่มต้นในช่องผลลัพธ์ เปลี่ยนตามคดี */
  placeholderNote: string;
  /** คิวรีตั้งต้นของคดีนี้ — เติมไว้ในช่องเขียนให้เลย มือใหม่จะได้ไม่เจอหน้าจอเปล่า */
  starter: string;
  /** รีเซ็ตช่องเขียนเมื่อค่านี้เปลี่ยน (ใช้เลขคดี) */
  resetKey: number;
  /**
   * คำขอวางคิวรีจากสมุดบันทึกหรือแผงตาราง — ต้องเป็น object ใหม่ทุกครั้งที่กด
   * แม้จะเป็นคิวรีเดิม เพื่อให้ effect ทำงานซ้ำได้
   */
  insertRequest: { sql: string } | null;
  /** เก็บคิวรีที่เขียนค้างอยู่ลงสมุดบันทึก */
  onSaveQuery: (sql: string) => void;
}

export default function QueryConsole({
  db,
  placeholderNote,
  starter,
  resetKey,
  insertRequest,
  onSaveQuery,
}: Props) {
  const [sql, setSql] = useState(starter);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [note, setNote] = useState<{ tone: MessageTone; text: string }>({
    tone: "info",
    text: placeholderNote,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // เปลี่ยนคดีแล้วเริ่มจากคิวรีตั้งต้นของคดีใหม่เสมอ — ไม่ผูกกับ placeholderNote
  // ซึ่งเปลี่ยนตอนโหลดฐานข้อมูลเสร็จด้วย และจะลบสิ่งที่ผู้เล่นพิมพ์ค้างไว้ทิ้ง
  // (starter เปลี่ยนพร้อม resetKey พอดี เพราะทั้งคู่มาจากคดีเดียวกัน)
  useEffect(() => {
    setSql(starter);
    setResult(null);
    textareaRef.current?.focus();
  }, [resetKey, starter]);

  useEffect(() => {
    setNote({ tone: "info", text: placeholderNote });
  }, [placeholderNote]);

  useEffect(() => {
    if (!insertRequest) return;
    setSql(insertRequest.sql);
    setNote({ tone: "info", text: "วางคิวรีลงคอนโซลแล้ว — กด “รันคิวรี” เพื่อดูผล" });
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
        setNote({
          tone: "info",
          text: "คิวรีรันผ่าน แต่ไม่มีแถวไหนตรงเงื่อนไขเลย — ลองตัดเงื่อนไขใน WHERE ออกทีละข้อ ดูว่าตกหล่นตรงไหน (ค่าข้อความต้องตรงเป๊ะ เช่น 'red' ไม่ใช่ 'Red')",
        });
        return;
      }
      setResult(res);
      setNote({
        tone: "ok",
        text:
          res.values.length === 1
            ? "ได้ 1 แถว — ถ้าตรงกับที่โจทย์ถาม เอาไปตอบในช่อง “สรุปสำนวน” ข้างล่างได้เลย"
            : `ได้ ${res.values.length} แถว`,
      });
    } catch (e) {
      setResult(null);
      setNote({
        tone: "error",
        text: explainSqlError(e instanceof Error ? e.message : String(e)),
      });
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
          disabled={sql === starter}
          onClick={() => {
            setSql(starter);
            setResult(null);
            setNote({ tone: "info", text: "ย้อนกลับมาที่คิวรีตั้งต้นของคดีนี้แล้ว" });
            textareaRef.current?.focus();
          }}
        >
          ↺ คิวรีตั้งต้น
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
