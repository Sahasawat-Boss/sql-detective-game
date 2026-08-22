import { DEFAULT_NAMES } from "@/data/seed";
import type { DetectiveCase } from "@/types";

/**
 * แม่แบบคดี — เหมือน DetectiveCase ทุกอย่าง ยกเว้น 2 จุด:
 * - brief ใส่ {{name<id>}} แทนชื่อคน id นั้นได้ จะถูกแทนด้วยชื่อเล่นของรอบเล่นนี้ตอน build
 * - ถ้าคำตอบคือชื่อคน ใส่ answerPersonId แทนการเขียนชื่อตรง ๆ ระบบจะคำนวณชื่อเต็ม/ชื่อเล่น
 *   ที่ยอมรับให้เองจากชื่อของรอบเล่นนี้ (answers ใช้กับคำตอบที่ไม่ใช่ชื่อคน เช่น สถานที่)
 */
interface CaseTemplate extends Omit<DetectiveCase, "answers"> {
  answerPersonId?: number;
  answers?: string[];
}

/**
 * คดีทั้งหมด เรียงจากง่ายไปยาก
 * คดี 6-8 ต่อกันเป็นเนื้อเรื่องเดียว (คดีพ่นสีกำแพงเมืองเก่า)
 * เพิ่มคดีใหม่ได้โดยต่อ object ท้าย array นี้
 */
const TEMPLATES: CaseTemplate[] = [
  {
    n: 1,
    title: "ทิ้งขยะในสวนสาธารณะ",
    level: "SELECT · WHERE",
    brief:
      "มีคนทิ้งถุงขนมไว้ข้างม้านั่งใน Zorange Park พยานให้การว่าผู้ต้องสงสัย <b>ใส่หมวกสีแดง</b> และ <b>สูงเกิน 180 ซม.</b>",
    goal: "ผู้ต้องสงสัยชื่ออะไร?",
    tables: ["people"],
    hint: "ใช้ <code>WHERE</code> กรองสองเงื่อนไขพร้อมกันด้วย <code>AND</code> — สีหมวกเก็บเป็นภาษาอังกฤษว่า <code>'red'</code>",
    solution: `SELECT name FROM people
WHERE hat_color = 'red' AND height_cm > 180;`,
    answerPersonId: 1,
  },
  {
    n: 2,
    title: "เสียงดังกลางดึก",
    level: "ORDER BY · LIMIT",
    brief:
      "เรื่องร้องเรียนเสียงดัง (<code>type = 'noise'</code>) เข้ามาหลายเคส หัวหน้าอยากรู้ว่า<b>เคสล่าสุด</b>เกิดที่ไหน",
    goal: "สถานที่ของเรื่องร้องเรียนประเภท noise ที่ใหม่ที่สุด?",
    tables: ["complaints"],
    hint: "กรองด้วย <code>WHERE type='noise'</code> แล้วเรียงเวลาจากมากไปน้อยด้วย <code>ORDER BY reported_at DESC</code> จากนั้นเอาแค่แถวเดียวด้วย <code>LIMIT 1</code>",
    solution: `SELECT location, reported_at FROM complaints
WHERE type = 'noise'
ORDER BY reported_at DESC
LIMIT 1;`,
    answers: ["Downtown Plaza"],
  },
  {
    n: 3,
    title: "รถคันที่จอดขวาง",
    level: "JOIN",
    brief:
      "มีใบสั่งจอดรถที่ <b>Zorange Mall</b> ที่ <b>ยังไม่จ่ายค่าปรับ</b> (<code>paid = 0</code>) อยู่ใบเดียว ต้องตามหาเจ้าของรถ",
    goal: "เจ้าของรถคันนั้นชื่ออะไร?",
    tables: ["parking_tickets", "vehicles", "people"],
    hint: "ต่อสามตาราง: <code>parking_tickets</code> เชื่อม <code>vehicles</code> ด้วย <code>plate</code> แล้ว <code>vehicles.owner_id</code> เชื่อม <code>people.id</code>",
    solution: `SELECT p.name, t.plate
FROM parking_tickets t
JOIN vehicles v ON v.plate = t.plate
JOIN people p ON p.id = v.owner_id
WHERE t.location = 'Zorange Mall' AND t.paid = 0;`,
    answerPersonId: 2,
  },
  {
    n: 4,
    title: "เงาในตรอกนีออน",
    level: "GROUP BY · COUNT",
    brief:
      "กล้องวงจรปิดที่ <b>Neon Alley</b> จับภาพคนไว้หลายคน เราสงสัยคนที่<b>ปรากฏตัวบ่อยที่สุด</b>",
    goal: "คนที่ถูกกล้อง Neon Alley จับได้บ่อยที่สุดชื่ออะไร?",
    tables: ["cctv_logs", "people"],
    hint: "นับจำนวนด้วย <code>COUNT(*)</code> จับกลุ่มด้วย <code>GROUP BY person_id</code> แล้ว <code>ORDER BY COUNT(*) DESC LIMIT 1</code>",
    solution: `SELECT p.name, COUNT(*) AS times
FROM cctv_logs c
JOIN people p ON p.id = c.person_id
WHERE c.camera_location = 'Neon Alley'
GROUP BY p.id, p.name
ORDER BY times DESC
LIMIT 1;`,
    answerPersonId: 10,
  },
  {
    n: 5,
    title: "แขกที่ไม่ยอมเช็คเอาท์",
    level: "เปรียบเทียบวันเวลา",
    brief:
      "โรงแรม Zorange Grand แจ้งว่ามีแขก <b>ออกจากห้องช้ากว่าเวลาเช็คเอาท์</b> ที่ตกลงไว้",
    goal: "แขกคนนั้นชื่ออะไร?",
    tables: ["hotel_stays", "people"],
    hint: "วันเวลาเก็บเป็นข้อความรูปแบบ <code>YYYY-MM-DD HH:MM</code> เลยเทียบตรง ๆ ได้: <code>WHERE actual_checkout &gt; check_out</code>",
    solution: `SELECT p.name, h.room, h.check_out, h.actual_checkout
FROM hotel_stays h
JOIN people p ON p.id = h.guest_id
WHERE h.actual_checkout > h.check_out;`,
    answerPersonId: 7,
  },
  {
    n: 6,
    title: "พ่นสีบนกำแพงเมืองเก่า — คนที่ไม่มีข้อแก้ตัว",
    level: "Subquery · NOT IN",
    brief:
      "คืนวันที่ <b>6 มี.ค. 2026</b> มีคนพ่นสีที่ Old Town Wall ผู้ต้องสงสัยเบื้องต้นคือคนที่อาศัยในเขต <b>Old Town</b> ใครที่<b>ไม่มีบันทึกกล้องเลย</b>ในคืนนั้น (00:00–04:00) ถือว่าไม่มีข้อแก้ตัว",
    goal: "คนใน Old Town ที่ไม่มีบันทึกกล้องคืนนั้นชื่ออะไร?",
    tables: ["people", "cctv_logs"],
    hint: "หา id ที่ปรากฏในกล้องคืนนั้นก่อน แล้วใช้ <code>WHERE district='Old Town' AND id NOT IN (...)</code>",
    solution: `SELECT name FROM people
WHERE district = 'Old Town'
  AND id NOT IN (
    SELECT person_id FROM cctv_logs
    WHERE seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00'
  );`,
    answerPersonId: 17,
  },
  {
    n: 7,
    title: "ใครโทรหาผู้ต้องสงสัยบ่อยผิดปกติ",
    level: "GROUP BY · HAVING",
    brief:
      "{{name17}} (<code>id = 17</code>) ยืนยันว่าถูกใส่ร้าย ลองดูสายที่โทรเข้าหาเขา หาคนที่โทรหา <b>มากกว่า 2 ครั้ง</b> และ <b>รวมเวลาเกิน 600 วินาที</b>",
    goal: "คนที่เข้าเงื่อนไขนั้นชื่ออะไร?",
    tables: ["phone_calls", "people"],
    hint: "เงื่อนไขที่คิดจากค่ารวมของกลุ่มต้องอยู่ใน <code>HAVING</code> ไม่ใช่ <code>WHERE</code> เช่น <code>HAVING COUNT(*) &gt; 2 AND SUM(duration_sec) &gt; 600</code>",
    solution: `SELECT p.name, COUNT(*) AS calls, SUM(c.duration_sec) AS total_sec
FROM phone_calls c
JOIN people p ON p.id = c.caller_id
WHERE c.receiver_id = 17
GROUP BY p.id, p.name
HAVING COUNT(*) > 2 AND SUM(c.duration_sec) > 600;`,
    answerPersonId: 12,
  },
  {
    n: 8,
    title: "ปิดคดีกำแพงเมืองเก่า",
    level: "JOIN หลายตาราง · ช่วงเวลา",
    brief:
      "ถึงเวลาชี้ตัวคนจริง หาคนที่ <b>ซื้อสีสเปรย์</b> (<code>item = 'spray paint'</code>) <b>และ</b> ถูกกล้องที่ <b>Old Town Wall</b> จับได้ในคืนวันที่ 6 มี.ค. 2026",
    goal: "คนพ่นสีตัวจริงชื่ออะไร?",
    tables: ["purchases", "cctv_logs", "people"],
    hint: "เชื่อม <code>purchases</code> กับ <code>cctv_logs</code> ผ่าน <code>person_id</code> เดียวกัน แล้วกรองทั้งชื่อสินค้าและตำแหน่ง+ช่วงเวลาของกล้อง",
    solution: `SELECT DISTINCT p.name
FROM purchases pu
JOIN cctv_logs c ON c.person_id = pu.person_id
JOIN people p ON p.id = pu.person_id
WHERE pu.item = 'spray paint'
  AND c.camera_location = 'Old Town Wall'
  AND c.seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00';`,
    answerPersonId: 12,
  },
];

const nicknameOf = (fullName: string) => fullName.split(" ")[0];

/** แทน {{name<id>}} ในเนื้อคดีด้วยชื่อเล่นของคน id นั้นในรอบเล่นนี้ */
function resolveBrief(brief: string, names: string[]): string {
  return brief.replace(/\{\{name(\d+)\}\}/g, (_match, idStr: string) => {
    const full = names[Number(idStr) - 1];
    return full ? nicknameOf(full) : _match;
  });
}

/**
 * ประกอบคดีทั้งหมดของรอบเล่นนี้จากชื่อที่สุ่มมา (names[i] = ชื่อคน id เท่ากับ i + 1)
 * เรียกครั้งเดียวตอนเริ่มเกม เงื่อนไขคำตอบทุกคดีอิงกับ id ของ people เดิม
 * มีแค่ชื่อที่แสดงผลกับคำตอบที่ยอมรับเท่านั้นที่เปลี่ยนไปตามรอบเล่น
 */
export function buildCases(names: string[]): DetectiveCase[] {
  return TEMPLATES.map(({ answerPersonId, answers, brief, ...rest }) => {
    const accepted = [...(answers ?? [])];
    if (answerPersonId != null) {
      const full = names[answerPersonId - 1];
      accepted.push(full, nicknameOf(full));
    }
    return { ...rest, brief: resolveBrief(brief, names), answers: accepted };
  });
}

/** ชุดคดีแบบชื่อตั้งต้น ใช้เฉพาะที่ไม่สนใจ brief/answers จริง (เช่น รายการคดีในหน้า Home) */
export const CASES: DetectiveCase[] = buildCases(DEFAULT_NAMES);
