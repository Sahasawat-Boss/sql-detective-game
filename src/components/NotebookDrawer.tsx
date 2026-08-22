"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerNote } from "@/types";

interface Props {
  notes: PlayerNote[];
  /** เลขสำนวนที่เปิดอยู่ ใช้ติดป้ายให้โน้ตใบใหม่ว่าจดตอนด่านไหน */
  currentCaseN: number;
  onAdd: (body: string, caseN: number) => void;
  onUpdate: (id: string, body: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  /** ส่งคิวรีกลับไปวางในคอนโซล */
  onInsert: (sql: string) => void;
}

/** เวลาสั้น ๆ แบบ HH:MM ประกอบเอง ไม่พึ่ง locale ของเครื่อง */
const hhmm = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function NotebookDrawer({
  notes,
  currentCaseN,
  onAdd,
  onUpdate,
  onRemove,
  onClearAll,
  onInsert,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      // ปิดลิ้นชักแล้วอย่าให้สถานะกลางคันค้างไว้รอบหน้า
      setEditingId(null);
      setConfirmClear(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft, currentCaseN);
    setDraft("");
    draftRef.current?.focus();
  };

  const handleInsert = (sql: string) => {
    onInsert(sql);
    setOpen(false);
  };

  const startEdit = (note: PlayerNote) => {
    setEditingId(note.id);
    setEditDraft(note.body);
  };

  const saveEdit = () => {
    if (editingId && editDraft.trim()) onUpdate(editingId, editDraft);
    setEditingId(null);
  };

  return (
    <>
      <button
        type="button"
        className="notebook-fab"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) window.setTimeout(() => draftRef.current?.focus(), 300);
        }}
      >
        <span aria-hidden>📓</span>
        สมุดบันทึก
        {notes.length > 0 && <span className="notebook-badge">{notes.length}</span>}
      </button>

      {/* ฉากหลัง กดที่ไหนก็ปิด */}
      <div
        className="notebook-scrim"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className="notebook-drawer"
        data-open={open}
        aria-label="สมุดบันทึกของนักสืบ"
      >
        <div className="flex items-center gap-2 border-b border-ink/20 px-5 pb-3 pt-4">
          <div>
            <div className="eyebrow mb-0">notebook</div>
            <h2 className="m-0 font-display text-[20px] leading-tight">สมุดบันทึก</h2>
          </div>
          <button
            type="button"
            className="btn btn-paper ml-auto px-2.5 py-1"
            onClick={() => setOpen(false)}
            aria-label="ปิดสมุดบันทึก"
          >
            ✕
          </button>
        </div>

        {/* ช่องจดโน้ตใหม่ */}
        <div className="border-b border-dashed border-ink/20 px-5 py-3.5">
          <textarea
            ref={draftRef}
            value={draft}
            spellCheck={false}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAdd();
            }}
            placeholder="จดอะไรก็ได้ — เบาะแส หรือคิวรีที่อยากเก็บไว้ใช้ซ้ำ"
            aria-label="ข้อความโน้ตใหม่"
            className="block min-h-[68px] w-full resize-y rounded-sm border border-ink/25 bg-white/50 px-2.5 py-2 font-sans text-[13.5px] leading-relaxed outline-none placeholder:text-ink-soft/70 focus:bg-white/70"
          />
          <div className="mt-2 flex items-center gap-2">
            <button type="button" className="btn py-1.5" onClick={handleAdd} disabled={!draft.trim()}>
              จดลงสมุด
            </button>
            <span className="font-mono text-[10.5px] text-ink-soft">
              สำนวนที่ {String(currentCaseN).padStart(2, "0")} · Ctrl + Enter
            </span>
          </div>
        </div>

        {/* รายการโน้ต ใหม่สุดอยู่บน */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3.5">
          {notes.length === 0 ? (
            <p className="mt-6 text-center text-[13px] leading-relaxed text-ink-soft">
              ยังไม่มีโน้ต
              <br />
              กด <b>📌 เก็บคิวรี</b> ใต้คอนโซลเพื่อเก็บคำสั่งไว้ใช้ซ้ำในด่านถัดไป
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {notes.map((note) => (
                <li key={note.id} className="note-card">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className="chip">สำนวน {String(note.caseN).padStart(2, "0")}</span>
                    {note.kind === "query" && <span className="chip font-mono">SQL</span>}
                    <span className="ml-auto font-mono text-[10.5px] text-ink-soft">
                      {hhmm(note.createdAt)}
                    </span>
                  </div>

                  {editingId === note.id ? (
                    <>
                      <textarea
                        value={editDraft}
                        spellCheck={false}
                        autoFocus
                        onChange={(e) => setEditDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") saveEdit();
                          if (e.key === "Escape") {
                            e.stopPropagation();
                            setEditingId(null);
                          }
                        }}
                        aria-label="แก้ไขโน้ต"
                        className="block min-h-[76px] w-full resize-y rounded-sm border border-ink/25 bg-white/60 px-2.5 py-2 font-mono text-[12.5px] leading-relaxed outline-none"
                      />
                      <div className="mt-2 flex gap-1.5">
                        <button type="button" className="btn py-1" onClick={saveEdit}>
                          บันทึก
                        </button>
                        <button
                          type="button"
                          className="btn btn-paper py-1"
                          onClick={() => setEditingId(null)}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {note.kind === "query" ? (
                        <pre className="note-sql">{note.body}</pre>
                      ) : (
                        <p className="m-0 whitespace-pre-wrap text-[13.5px] leading-relaxed">
                          {note.body}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {note.kind === "query" && (
                          <button
                            type="button"
                            className="btn py-1"
                            onClick={() => handleInsert(note.body)}
                          >
                            ใส่คอนโซล
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-paper py-1"
                          onClick={() => startEdit(note)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          className="btn btn-paper ml-auto py-1"
                          onClick={() => onRemove(note.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {notes.length > 0 && (
          <div className="border-t border-ink/20 px-5 py-3">
            {confirmClear ? (
              <div className="flex items-center gap-1.5">
                <span className="mr-auto text-[12.5px]">ลบโน้ตทั้ง {notes.length} ใบ?</span>
                <button
                  type="button"
                  className="btn py-1"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                >
                  ลบเลย
                </button>
                <button
                  type="button"
                  className="btn btn-paper py-1"
                  onClick={() => setConfirmClear(false)}
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-paper py-1"
                onClick={() => setConfirmClear(true)}
              >
                ล้างสมุดทั้งเล่ม
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
