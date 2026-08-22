"use client";

import { useCallback, useEffect, useState } from "react";
import { looksLikeSql, newNoteId, readNotes, writeNotes } from "@/lib/notes";
import type { PlayerNote } from "@/types";

export interface UseNotes {
  notes: PlayerNote[];
  /** จดโน้ตใหม่ — เดาเองว่าเป็นคิวรีหรือข้อความจากตัวเนื้อ ถ้าไม่ระบุ kind มา */
  addNote: (body: string, caseN: number, kind?: PlayerNote["kind"]) => void;
  updateNote: (id: string, body: string) => void;
  removeNote: (id: string) => void;
  clearNotes: () => void;
}

/**
 * สมุดบันทึกของผู้เล่น เก็บลง localStorage
 *
 * อ่านค่าเดิมใน useEffect ไม่ใช่ตอน render แรก เพราะหน้า /play ถูก prerender ฝั่งเซิร์ฟเวอร์
 * ซึ่งไม่มี localStorage — ถ้าอ่านตอน render จะได้ HTML สองฝั่งไม่ตรงกัน (hydration mismatch)
 */
export function useNotes(): UseNotes {
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNotes(readNotes());
    setLoaded(true);
  }, []);

  useEffect(() => {
    // ต้องรอโหลดเสร็จก่อน ไม่งั้นค่า [] ตั้งต้นจะไปทับโน้ตเก่าที่เก็บไว้
    if (loaded) writeNotes(notes);
  }, [notes, loaded]);

  const addNote = useCallback(
    (body: string, caseN: number, kind?: PlayerNote["kind"]) => {
      const text = body.trim();
      if (!text) return;
      const note: PlayerNote = {
        id: newNoteId(),
        body: text,
        kind: kind ?? (looksLikeSql(text) ? "query" : "text"),
        caseN,
        createdAt: Date.now(),
      };
      setNotes((prev) => [note, ...prev]);
    },
    [],
  );

  const updateNote = useCallback((id: string, body: string) => {
    const text = body.trim();
    if (!text) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, body: text, kind: looksLikeSql(text) ? "query" : "text" } : n,
      ),
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotes = useCallback(() => setNotes([]), []);

  return { notes, addNote, updateNote, removeNote, clearNotes };
}
