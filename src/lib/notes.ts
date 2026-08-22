import type { PlayerNote } from "@/types";

/**
 * สมุดบันทึกของผู้เล่นเก็บลง localStorage ตรง ๆ ไม่ผูกกับรอบเล่น
 * รีเฟรชหน้าแล้วโน้ตยังอยู่ครบ (แม้ชื่อคนในเกมจะสุ่มใหม่ก็ตาม — ดู pickSessionNames ใน seed.ts)
 */
const STORAGE_KEY = "sql-detective:notes:v1";

/** ขึ้นต้นด้วยคำที่เริ่มคิวรีอ่านข้อมูล = ถือว่าโน้ตใบนี้เป็นคิวรี กดใส่คอนโซลกลับได้ */
const SQL_START = /^\s*(SELECT|WITH)\b/i;

export const looksLikeSql = (text: string): boolean => SQL_START.test(text);

function isPlayerNote(value: unknown): value is PlayerNote {
  if (typeof value !== "object" || value === null) return false;
  const n = value as Record<string, unknown>;
  return (
    typeof n.id === "string" &&
    typeof n.body === "string" &&
    (n.kind === "text" || n.kind === "query") &&
    typeof n.caseN === "number" &&
    typeof n.createdAt === "number"
  );
}

/** อ่านโน้ตทั้งหมด — เรียกได้เฉพาะฝั่งเบราว์เซอร์เท่านั้น */
export function readNotes(): PlayerNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPlayerNote) : [];
  } catch {
    // โหมดไม่ระบุตัวตน, เบราว์เซอร์ปิด site data หรือข้อมูลเดิมเสีย — เริ่มจากสมุดเปล่า
    return [];
  }
}

export function writeNotes(notes: PlayerNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // เขียนไม่ได้ (เต็มโควตา/ถูกบล็อก) — โน้ตยังอยู่ในหน่วยความจำจนกว่าจะปิดแท็บ
  }
}

/** id แบบไม่พึ่ง crypto.randomUUID ซึ่งใช้ไม่ได้ถ้าเสิร์ฟผ่าน http ที่ไม่ใช่ localhost */
export const newNoteId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
