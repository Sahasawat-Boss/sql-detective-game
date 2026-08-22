export interface DetectiveCase {
  /** เลขสำนวน แสดงบนแท็บ */
  n: number;
  title: string;
  /** ระดับ/หัวข้อ SQL ที่ฝึกในคดีนี้ */
  level: string;
  /** เนื้อคดี รองรับ HTML tag พื้นฐาน (<b>, <code>) */
  brief: string;
  /** คำถามที่ต้องตอบ */
  goal: string;
  /** ตารางที่เกี่ยวข้อง ใช้ไฮไลต์ใน SchemaPanel */
  tables: string[];
  hint: string;
  /** เฉลยคิวรี */
  solution: string;
  /** คำตอบที่ยอมรับ (เทียบแบบไม่สนตัวพิมพ์/ช่องว่าง) */
  answers: string[];
}

export interface QueryResult {
  columns: string[];
  values: (string | number | Uint8Array | null)[][];
}

/**
 * โน้ตหนึ่งใบในสมุดบันทึกของผู้เล่น
 * อยู่ข้ามคดี (จดที่สำนวน 3 แล้วเปิดอ่านตอนสำนวน 8 ได้) และข้ามการรีเฟรชหน้า
 */
export interface PlayerNote {
  id: string;
  /** เนื้อโน้ต — ถ้า kind เป็น "query" คือคิวรี SQL ที่กดใส่กลับคอนโซลได้ */
  body: string;
  kind: "text" | "query";
  /** เลขสำนวนตอนที่จด ใช้ติดป้ายว่าโน้ตใบนี้มาจากด่านไหน */
  caseN: number;
  /** epoch ms ใช้เรียงใหม่ไปเก่า */
  createdAt: number;
}

export type MessageTone = "info" | "ok" | "error";

export interface TableSchema {
  name: string;
  columns: string[];
}

/** ตัวอย่างคิวรีหนึ่งชิ้นในคู่มือ */
export interface GuideExample {
  /** พาดหัวสั้น ๆ ว่าตัวอย่างนี้ตอบคำถามอะไร */
  label: string;
  sql: string;
  /** คำอธิบาย รองรับ HTML tag พื้นฐาน (<b>, <code>) */
  explain: string;
  /** ผลลัพธ์คร่าว ๆ ที่ควรได้ (ไม่ใส่ก็ได้) */
  output?: string;
}

/** หัวข้อย่อยในบทหนึ่งของคู่มือ */
export interface GuideTopic {
  id: string;
  title: string;
  /** ใช้ตอนไหน */
  what: string;
  /** แม่แบบคำสั่ง */
  syntax: string;
  examples: GuideExample[];
  /** กับดักที่เจอบ่อย รองรับ HTML tag พื้นฐาน */
  pitfalls?: string[];
}

/** หนึ่งบทของคู่มือ เรียงจากง่ายไปยาก */
export interface GuideChapter {
  id: string;
  n: number;
  title: string;
  level: "พื้นฐาน" | "ระดับกลาง" | "ระดับสูง";
  summary: string;
  /** เลขสำนวนในเกมที่ได้ใช้บทนี้ */
  cases: number[];
  topics: GuideTopic[];
}
