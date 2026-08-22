import { applyPlaces, DEFAULT_PLACES, type PlaceMap } from "@/data/places";
import { DEFAULT_NAMES } from "@/data/seed";
import type { DetectiveCase } from "@/types";

/**
 * แม่แบบคดี — เหมือน DetectiveCase ทุกอย่าง ยกเว้น 2 จุด:
 * - brief ใส่ {{name<id>}} แทนชื่อคน id นั้นได้ จะถูกแทนด้วยชื่อเล่นของรอบเล่นนี้ตอน build
 * - ถ้าคำตอบคือชื่อคน ใส่ answerPersonId แทนการเขียนชื่อตรง ๆ ระบบจะคำนวณชื่อเต็ม/ชื่อเล่น
 *   ที่ยอมรับให้เองจากชื่อของรอบเล่นนี้
 *
 * ส่วน answers ใช้กับคำตอบที่ไม่ใช่ชื่อคน เช่นสถานที่หรือจำนวน — เขียนไว้ตรง ๆ ได้เลย
 * ตอน build จะถูกแทนด้วยชื่อของรอบเล่นนี้ให้เอง เหมือนที่แทนใน brief/hints/starter/solution
 */
interface CaseTemplate extends Omit<DetectiveCase, "answers"> {
  answerPersonId?: number;
  answers?: string[];
}

/**
 * คดีทั้งหมด เรียงจากง่ายไปยาก
 * 1-3   ฝึกหัด: จับทางเกมก่อน — SELECT ล้วน / WHERE เงื่อนไขเดียว / ORDER BY
 * 4-8   พื้นฐาน: WHERE หลายเงื่อนไข / ORDER BY · LIMIT / JOIN / GROUP BY / เทียบวันเวลา
 * 9-11  เนื้อเรื่องเดียวกัน (คดีพ่นสีกำแพงเมืองเก่า) — subquery, HAVING, JOIN หลายตาราง
 * 12-15 ระดับกลาง: anti-join, strftime, self join, COUNT(DISTINCT)
 * 16-19 เนื้อเรื่องเดียวกัน (ขบวนการเงินเทา) — window function, LAG, CTE, recursive CTE
 * เพิ่มคดีใหม่ได้โดยต่อ object ท้าย array นี้
 *
 * กติกาของ starter: ต้องเป็นคิวรีที่ "รันผ่าน" ได้ทันทีเสมอ ห้ามเว้นช่องว่างให้เติมจนรันไม่ได้
 * เพราะมือใหม่จะกดรันดูก่อนเป็นอย่างแรก ถ้าเจอ error ตั้งแต่ยังไม่ได้พิมพ์อะไรจะท้อทันที
 * ส่วนที่ต้องทำต่อให้เขียนเป็นคอมเมนต์ -- ใต้คิวรีแทน
 *
 * กติกาของ hints: ไล่จากง่ายไปยากเสมอ ใบแรก "ชี้ทางคิด" ห้ามมีคำสั่ง SQL เต็มรูป
 * ใบสุดท้ายบอกคำสั่งที่ต้องใช้ได้ แต่ยังไม่ใช่คิวรีทั้งก้อน (ก้อนเต็มอยู่ใน solution)
 */
const TEMPLATES: CaseTemplate[] = [
  {
    n: 1,
    tutorial: true,
    title: "วันแรกที่แผนก — เปิดแฟ้มทะเบียนราษฎร์",
    level: "SELECT",
    brief:
      "ยินดีต้อนรับสู่แผนกคดีจิ๊บจ๊อย งานแรกยังไม่มีคดี หัวหน้าแค่ให้ลอง<b>เปิดแฟ้มทะเบียนราษฎร์</b> (ตาราง <code>people</code>) ดูว่าในเมืองนี้มีข้อมูลอะไรบ้าง — คิวรีเขียนรอไว้ให้แล้วในคอนโซลข้างล่าง <b>กดปุ่ม “รันคิวรี” ได้เลย</b>",
    goal: "ในแฟ้มทะเบียน คนที่ id = 9 ชื่ออะไร?",
    tables: ["people"],
    starter: `SELECT * FROM people;`,
    hints: [
      "กดปุ่ม <b>รันคิวรี</b> ใต้ช่องพิมพ์ได้เลย (หรือกด <code>Ctrl + Enter</code>) ตารางผลลัพธ์จะโผล่ขึ้นมาข้างล่าง",
      "อ่านคิวรีทีละคำ: <code>SELECT *</code> = “เอาทุกคอลัมน์”, <code>FROM people</code> = “จากตาราง people”, <code>;</code> = “จบคำสั่ง”",
      "ในตารางผลลัพธ์ ไล่หาแถวที่คอลัมน์ <code>id</code> เป็น <b>9</b> แล้วอ่านชื่อจากคอลัมน์ <code>name</code> — เอาชื่อนั้นไปพิมพ์ในช่อง “สรุปสำนวน”",
    ],
    solution: `SELECT * FROM people;`,
    answerPersonId: 9,
  },
  {
    n: 2,
    tutorial: true,
    title: "ฝึกหัด — คัดเฉพาะคนใส่หมวกแดง",
    level: "WHERE · นับแถว",
    brief:
      "แฟ้มมีคนเป็นสิบ ๆ อ่านทั้งหมดไม่ไหว หัวหน้าเลยสอนท่า<b>กรองแถว</b>ด้วย <code>WHERE</code> — คิวรีตั้งต้นกรอง <b>คนใส่หมวกสีแดง</b> ไว้ให้แล้ว (สีเก็บเป็นภาษาอังกฤษ และค่าที่เป็นข้อความต้องอยู่ในเครื่องหมาย <code>'</code> เสมอ)",
    goal: "ในเมืองนี้มีคนใส่หมวกสีแดงกี่คน? (ตอบเป็นตัวเลข)",
    tables: ["people"],
    starter: `SELECT name, hat_color FROM people
WHERE hat_color = 'red';`,
    hints: [
      "กดรันดูก่อน แล้วนับจำนวนแถวที่ได้ — ใต้ตารางผลลัพธ์มีตัวเลขบอกจำนวนแถวอยู่แล้ว",
      "<code>WHERE</code> อ่านว่า “เอาเฉพาะแถวที่…” ลองเปลี่ยน <code>'red'</code> เป็น <code>'blue'</code> ดูก็ได้ว่าผลเปลี่ยนไหม (ตัวพิมพ์ต้องตรงเป๊ะ <code>'red'</code> ไม่ใช่ <code>'Red'</code>)",
      "ให้ SQL นับแทนก็ได้: <code>SELECT COUNT(*) FROM people WHERE hat_color = 'red';</code>",
    ],
    solution: `SELECT COUNT(*) AS total
FROM people
WHERE hat_color = 'red';`,
    answers: ["8"],
  },
  {
    n: 3,
    tutorial: true,
    title: "ฝึกหัด — คนอายุน้อยที่สุดในเมือง",
    level: "ORDER BY · LIMIT",
    brief:
      "ท่าสุดท้ายก่อนรับคดีจริง: <b>เรียงลำดับ</b> ฝ่ายทะเบียนขอชื่อคนที่<b>อายุน้อยที่สุด</b>ในเมือง คิวรีตั้งต้นเรียงตามอายุจากน้อยไปมากไว้ให้แล้ว",
    goal: "คนที่อายุน้อยที่สุดในเมืองชื่ออะไร?",
    tables: ["people"],
    starter: `SELECT name, age FROM people
ORDER BY age;`,
    hints: [
      "กดรันแล้วดู <b>แถวบนสุด</b> — <code>ORDER BY age</code> เรียงจากน้อยไปมากให้อยู่แล้ว",
      "อยากเรียงกลับด้าน (มากไปน้อย) เติม <code>DESC</code> ต่อท้าย: <code>ORDER BY age DESC</code>",
      "อยากได้แถวเดียวพอ เติม <code>LIMIT 1</code> ปิดท้ายคิวรี",
    ],
    solution: `SELECT name, age FROM people
ORDER BY age
LIMIT 1;`,
    answerPersonId: 31,
  },
  {
    n: 4,
    title: "ทิ้งขยะในสวนสาธารณะ",
    level: "WHERE · AND",
    brief:
      "คดีจริงคดีแรก มีคนทิ้งถุงขนมไว้ข้างม้านั่งใน Zorange Park พยานให้การว่าผู้ต้องสงสัย <b>ใส่หมวกสีแดง</b> และ <b>สูงเกิน 180 ซม.</b>",
    goal: "ผู้ต้องสงสัยชื่ออะไร?",
    tables: ["people"],
    starter: `SELECT name, hat_color, height_cm FROM people
WHERE hat_color = 'red';
-- เหลืออีกเงื่อนไข: สูงเกิน 180 ซม. — เติมต่อท้ายด้วย AND height_cm > 180`,
    hints: [
      "คำให้การมีสองเงื่อนไข ต้องเป็นจริงพร้อมกันทั้งคู่ — ใน SQL ใช้ <code>AND</code> เชื่อม",
      "ตัวเลขไม่ต้องใส่เครื่องหมาย <code>'</code> เขียน <code>height_cm > 180</code> ได้เลย",
      "ใช้ <code>WHERE</code> กรองสองเงื่อนไขพร้อมกันด้วย <code>AND</code> — สีหมวกเก็บเป็นภาษาอังกฤษว่า <code>'red'</code>",
    ],
    solution: `SELECT name FROM people
WHERE hat_color = 'red' AND height_cm > 180;`,
    answerPersonId: 1,
  },
  {
    n: 5,
    title: "เสียงดังกลางดึก",
    level: "ORDER BY · LIMIT",
    brief:
      "เรื่องร้องเรียนเสียงดัง (<code>type = 'noise'</code>) เข้ามาหลายเคส หัวหน้าอยากรู้ว่า<b>เคสล่าสุด</b>เกิดที่ไหน",
    goal: "สถานที่ของเรื่องร้องเรียนประเภท noise ที่ใหม่ที่สุด?",
    tables: ["complaints"],
    starter: `SELECT type, location, reported_at FROM complaints;
-- ทำสามขั้น: 1) กรอง type = 'noise'  2) เรียง reported_at ใหม่ไปเก่า  3) เอาแค่แถวเดียว`,
    hints: [
      "คดีนี้ตอบเป็น<b>สถานที่</b> ไม่ใช่ชื่อคน — ดูคอลัมน์ <code>location</code>",
      "“ล่าสุด” = วันเวลามากที่สุด เลยต้องเรียงจากมากไปน้อยแล้วหยิบแถวแรก",
      "กรองด้วย <code>WHERE type='noise'</code> แล้วเรียงเวลาจากมากไปน้อยด้วย <code>ORDER BY reported_at DESC</code> จากนั้นเอาแค่แถวเดียวด้วย <code>LIMIT 1</code>",
    ],
    solution: `SELECT location, reported_at FROM complaints
WHERE type = 'noise'
ORDER BY reported_at DESC
LIMIT 1;`,
    answers: ["Downtown Plaza"],
  },
  {
    n: 6,
    title: "รถคันที่จอดขวาง",
    level: "JOIN",
    brief:
      "มีใบสั่งจอดรถที่ <b>Zorange Mall</b> ที่ <b>ยังไม่จ่ายค่าปรับ</b> (<code>paid = 0</code>) อยู่ใบเดียว ต้องตามหาเจ้าของรถ",
    goal: "เจ้าของรถคันนั้นชื่ออะไร?",
    tables: ["parking_tickets", "vehicles", "people"],
    starter: `SELECT * FROM parking_tickets
WHERE location = 'Zorange Mall' AND paid = 0;
-- ได้ทะเบียนรถแล้ว แต่ยังไม่ได้ชื่อคน — ต้องต่อไปที่ vehicles แล้วต่อไป people`,
    hints: [
      "ข้อมูลที่ต้องการอยู่คนละตาราง: ใบสั่งมีแค่<b>ทะเบียน</b> ต้องเอาทะเบียนไปหา<b>รถ</b> แล้วเอารถไปหา<b>เจ้าของ</b>",
      "<code>JOIN</code> คือการบอกว่า “สองตารางนี้ผูกกันด้วยคอลัมน์ไหน” เช่น <code>JOIN vehicles v ON v.plate = t.plate</code>",
      "ต่อสามตาราง: <code>parking_tickets</code> เชื่อม <code>vehicles</code> ด้วย <code>plate</code> แล้ว <code>vehicles.owner_id</code> เชื่อม <code>people.id</code>",
    ],
    solution: `SELECT p.name, t.plate
FROM parking_tickets t
JOIN vehicles v ON v.plate = t.plate
JOIN people p ON p.id = v.owner_id
WHERE t.location = 'Zorange Mall' AND t.paid = 0;`,
    answerPersonId: 2,
  },
  {
    n: 7,
    title: "เงาในตรอกนีออน",
    level: "GROUP BY · COUNT",
    brief:
      "กล้องวงจรปิดที่ <b>Neon Alley</b> จับภาพคนไว้หลายคน เราสงสัยคนที่<b>ปรากฏตัวบ่อยที่สุด</b>",
    goal: "คนที่ถูกกล้อง Neon Alley จับได้บ่อยที่สุดชื่ออะไร?",
    tables: ["cctv_logs", "people"],
    starter: `SELECT * FROM cctv_logs
WHERE camera_location = 'Neon Alley';
-- ตอนนี้เห็นทุกครั้งที่กล้องจับได้ ขั้นต่อไปคือ "นับต่อคน" ด้วย GROUP BY person_id`,
    hints: [
      "โจทย์ถามว่า “บ่อยที่สุด” แปลว่าต้องนับก่อนว่าแต่ละคนโผล่กี่ครั้ง แล้วค่อยเรียงหาคนที่มากสุด",
      "<code>GROUP BY person_id</code> คือการยุบแถวของคนเดียวกันให้เหลือแถวเดียว แล้ว <code>COUNT(*)</code> จะบอกว่ายุบมาจากกี่แถว",
      "นับจำนวนด้วย <code>COUNT(*)</code> จับกลุ่มด้วย <code>GROUP BY person_id</code> แล้ว <code>ORDER BY COUNT(*) DESC LIMIT 1</code>",
    ],
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
    n: 8,
    title: "แขกที่ไม่ยอมเช็คเอาท์",
    level: "เปรียบเทียบวันเวลา",
    brief:
      "โรงแรม Zorange Grand แจ้งว่ามีแขก <b>ออกจากห้องช้ากว่าเวลาเช็คเอาท์</b> ที่ตกลงไว้",
    goal: "แขกคนนั้นชื่ออะไร?",
    tables: ["hotel_stays", "people"],
    starter: `SELECT * FROM hotel_stays;
-- เทียบสองคอลัมน์กันเอง: actual_checkout (ออกจริง) กับ check_out (นัดไว้)`,
    hints: [
      "คราวนี้ไม่ได้เทียบคอลัมน์กับค่าคงที่ แต่เทียบ<b>คอลัมน์กับคอลัมน์</b>ในแถวเดียวกัน",
      "ได้เลขห้องแล้วยังไม่ได้ชื่อ — ต้อง <code>JOIN people</code> ด้วย <code>guest_id</code>",
      "วันเวลาเก็บเป็นข้อความรูปแบบ <code>YYYY-MM-DD HH:MM</code> เลยเทียบตรง ๆ ได้: <code>WHERE actual_checkout &gt; check_out</code>",
    ],
    solution: `SELECT p.name, h.room, h.check_out, h.actual_checkout
FROM hotel_stays h
JOIN people p ON p.id = h.guest_id
WHERE h.actual_checkout > h.check_out;`,
    answerPersonId: 7,
  },
  {
    n: 9,
    title: "พ่นสีบนกำแพงเมืองเก่า — คนที่ไม่มีข้อแก้ตัว",
    level: "Subquery · NOT IN",
    brief:
      "คืนวันที่ <b>6 มี.ค. 2026</b> มีคนพ่นสีที่ Old Town Wall ผู้ต้องสงสัยเบื้องต้นคือคนที่อาศัยในเขต <b>Old Town</b> ใครที่<b>ไม่มีบันทึกกล้องเลย</b>ในคืนนั้น (00:00–04:00) ถือว่าไม่มีข้อแก้ตัว",
    goal: "คนใน Old Town ที่ไม่มีบันทึกกล้องคืนนั้นชื่ออะไร?",
    tables: ["people", "cctv_logs"],
    starter: `SELECT person_id, seen_at FROM cctv_logs
WHERE seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00';
-- นี่คือ "คนที่มีข้อแก้ตัว" — คำตอบคือคนใน Old Town ที่ไม่อยู่ในลิสต์นี้`,
    hints: [
      "คิดกลับด้าน: หา “คนที่มีหลักฐานว่าอยู่ไหนคืนนั้น” ก่อน แล้วคำตอบคือคนที่<b>ไม่อยู่</b>ในลิสต์นั้น",
      "เอาคิวรีตั้งต้นทั้งก้อนไปใส่ในวงเล็บของ <code>NOT IN ( ... )</code> ได้เลย แต่ข้างในต้อง <code>SELECT</code> คอลัมน์เดียวคือ <code>person_id</code>",
      "หา id ที่ปรากฏในกล้องคืนนั้นก่อน แล้วใช้ <code>WHERE district='Old Town' AND id NOT IN (...)</code>",
    ],
    solution: `SELECT name FROM people
WHERE district = 'Old Town'
  AND id NOT IN (
    SELECT person_id FROM cctv_logs
    WHERE seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00'
  );`,
    answerPersonId: 17,
  },
  {
    n: 10,
    title: "ใครโทรหาผู้ต้องสงสัยบ่อยผิดปกติ",
    level: "GROUP BY · HAVING",
    brief:
      "{{name17}} (<code>id = 17</code>) ยืนยันว่าถูกใส่ร้าย ลองดูสายที่โทรเข้าหาเขา หาคนที่โทรหา <b>มากกว่า 2 ครั้ง</b> และ <b>รวมเวลาเกิน 600 วินาที</b>",
    goal: "คนที่เข้าเงื่อนไขนั้นชื่ออะไร?",
    tables: ["phone_calls", "people"],
    starter: `SELECT caller_id, COUNT(*) AS calls, SUM(duration_sec) AS total_sec
FROM phone_calls
WHERE receiver_id = 17
GROUP BY caller_id;
-- เหลือกรองกลุ่มที่ calls > 2 และ total_sec > 600 (ของแบบนี้ใช้ HAVING ไม่ใช่ WHERE)`,
    hints: [
      "เงื่อนไขของโจทย์ไม่ได้พูดถึงแถวเดี่ยว ๆ แต่พูดถึง<b>ยอดรวมของแต่ละคน</b> เลยต้องกรองหลังจัดกลุ่มแล้ว",
      "<code>WHERE</code> กรองก่อนจัดกลุ่ม ส่วน <code>HAVING</code> กรองหลังจัดกลุ่ม",
      "เงื่อนไขที่คิดจากค่ารวมของกลุ่มต้องอยู่ใน <code>HAVING</code> ไม่ใช่ <code>WHERE</code> เช่น <code>HAVING COUNT(*) &gt; 2 AND SUM(duration_sec) &gt; 600</code>",
    ],
    solution: `SELECT p.name, COUNT(*) AS calls, SUM(c.duration_sec) AS total_sec
FROM phone_calls c
JOIN people p ON p.id = c.caller_id
WHERE c.receiver_id = 17
GROUP BY p.id, p.name
HAVING COUNT(*) > 2 AND SUM(c.duration_sec) > 600;`,
    answerPersonId: 12,
  },
  {
    n: 11,
    title: "ปิดคดีกำแพงเมืองเก่า",
    level: "JOIN หลายตาราง · ช่วงเวลา",
    brief:
      "ถึงเวลาชี้ตัวคนจริง หาคนที่ <b>ซื้อสีสเปรย์</b> (<code>item = 'spray paint'</code>) <b>และ</b> ถูกกล้องที่ <b>Old Town Wall</b> จับได้ในคืนวันที่ 6 มี.ค. 2026",
    goal: "คนพ่นสีตัวจริงชื่ออะไร?",
    tables: ["purchases", "cctv_logs", "people"],
    starter: `SELECT * FROM purchases
WHERE item = 'spray paint';
-- ได้ลิสต์คนซื้อสเปรย์แล้ว เหลือเช็คว่าใครในนี้ติดกล้อง Old Town Wall คืนนั้นด้วย`,
    hints: [
      "โจทย์ใช้คำว่า “และ” — คนคนนั้นต้องโผล่ทั้งในตารางการซื้อ <b>และ</b> ในบันทึกกล้อง",
      "<code>JOIN</code> ไม่จำเป็นต้องต่อด้วย id ของตารางหลักเสมอไป ตรงนี้ต่อสองตารางด้วย <code>person_id</code> ที่ตรงกัน",
      "เชื่อม <code>purchases</code> กับ <code>cctv_logs</code> ผ่าน <code>person_id</code> เดียวกัน แล้วกรองทั้งชื่อสินค้าและตำแหน่ง+ช่วงเวลาของกล้อง",
    ],
    solution: `SELECT DISTINCT p.name
FROM purchases pu
JOIN cctv_logs c ON c.person_id = pu.person_id
JOIN people p ON p.id = pu.person_id
WHERE pu.item = 'spray paint'
  AND c.camera_location = 'Old Town Wall'
  AND c.seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00';`,
    answerPersonId: 12,
  },
  {
    n: 12,
    title: "บัตรที่ไม่มีอยู่ในระบบ",
    level: "LEFT JOIN · IS NULL",
    brief:
      "ท่าเรือ <b>Harbor</b> แจ้งของหาย คนที่อยู่แถวนั้นทุกคนต้องมีบัตรโดยสาร (<code>transit_cards</code>) ลงทะเบียนไว้ — แต่มีคนในเขต <b>Harbor</b> อยู่คนเดียวที่<b>ไม่มีบัตรในระบบเลย</b>",
    goal: "คนใน Harbor ที่ไม่มีบัตรโดยสารชื่ออะไร?",
    tables: ["people", "transit_cards"],
    starter: `SELECT p.name, c.card_no
FROM people p
LEFT JOIN transit_cards c ON c.owner_id = p.id
WHERE p.district = 'Harbor';
-- LEFT JOIN เก็บคนไว้ครบทุกคน คนที่ไม่มีบัตรจะได้ card_no เป็นค่าว่าง (NULL)`,
    hints: [
      "กดรันดูก่อน แล้วมองหาแถวที่ช่อง <code>card_no</code> ว่างเปล่า — นั่นแหละคำตอบ",
      "ค่าว่างใน SQL เทียบด้วย <code>=</code> ไม่ได้ ต้องเขียน <code>IS NULL</code>",
      "ต่อด้วย <code>LEFT JOIN</code> เพื่อเก็บคนไว้ครบทุกคน แล้วกรองแถวที่ฝั่งบัตรว่างด้วย <code>WHERE c.card_no IS NULL</code> (ท่านี้เรียกว่า anti-join)",
    ],
    solution: `SELECT p.name
FROM people p
LEFT JOIN transit_cards c ON c.owner_id = p.id
WHERE p.district = 'Harbor' AND c.card_no IS NULL;`,
    answerPersonId: 25,
  },
  {
    n: 13,
    title: "คนที่ตื่นตอนตีสอง",
    level: "strftime · GROUP BY",
    brief:
      "เหตุหลายคดีเกิดช่วง <b>ตีสองถึงตีสี่</b> ลองไล่บันทึกกล้องทั้งเมืองดูว่าใครโผล่ในช่วงเวลานั้น (ชั่วโมง <code>02</code> และ <code>03</code>) <b>บ่อยที่สุด</b>",
    goal: "คนที่ติดกล้องช่วงตีสองถึงตีสี่บ่อยที่สุดชื่ออะไร?",
    tables: ["cctv_logs", "people"],
    starter: `SELECT person_id, seen_at, strftime('%H', seen_at) AS hour
FROM cctv_logs;
-- ได้คอลัมน์ชั่วโมงแล้ว เหลือกรองเฉพาะ '02','03' แล้วนับต่อคน`,
    hints: [
      "เวลาเก็บเป็นข้อความทั้งก้อน ต้องดึงเฉพาะ<b>ชั่วโมง</b>ออกมาก่อนถึงจะกรองได้",
      "<code>strftime('%H', seen_at)</code> คืนค่าเป็น<b>ข้อความ</b> เลยต้องเทียบกับ <code>'02'</code> ไม่ใช่ <code>2</code>",
      "ดึงเฉพาะชั่วโมงออกมาด้วย <code>strftime('%H', seen_at)</code> แล้วกรองด้วย <code>IN ('02','03')</code> จากนั้นนับต่อคนด้วย <code>GROUP BY</code>",
    ],
    solution: `SELECT p.name, COUNT(*) AS times
FROM cctv_logs c
JOIN people p ON p.id = c.person_id
WHERE strftime('%H', c.seen_at) IN ('02', '03')
GROUP BY p.id, p.name
ORDER BY times DESC
LIMIT 1;`,
    answerPersonId: 27,
  },
  {
    n: 14,
    title: "บัตรใบเดียว สองสถานี",
    level: "SELF JOIN · julianday",
    brief:
      "มีคนแจ้งว่าบัตรโดยสารถูกใช้ซ้อน ถ้าบัตรใบเดียวถูกแตะที่<b>สองสถานีต่างกัน</b>ห่างกัน<b>ไม่ถึง 5 นาที</b> แปลว่ามีคนก๊อปบัตรไปใช้ — เมืองนี้มีบัตรแบบนั้นอยู่ใบเดียว",
    goal: "เจ้าของบัตรใบนั้นชื่ออะไร?",
    tables: ["transit_taps", "transit_cards", "people"],
    starter: `SELECT * FROM transit_taps
ORDER BY card_no, tapped_at;
-- ต้องเทียบสองแถวของบัตรใบเดียวกัน — ทำได้ด้วยการ JOIN ตารางนี้กับตัวเอง`,
    hints: [
      "โจทย์เทียบ “แถวหนึ่งกับอีกแถวหนึ่ง” ในตารางเดียวกัน ท่านี้คือเอาตารางมาต่อกับตัวเองแล้วตั้งชื่อย่อคนละชื่อ (<code>a</code> กับ <code>b</code>)",
      "เงื่อนไขที่ต้องใส่ใน <code>ON</code>: บัตรเดียวกัน, สถานีต่างกัน (<code>&lt;&gt;</code>), และ b เกิดหลัง a",
      "ต่อ <code>transit_taps</code> เข้ากับตัวเอง (<code>a</code> กับ <code>b</code>) ด้วย <code>card_no</code> เดียวกันแต่ <code>station</code> ต่างกัน แล้วคิดส่วนต่างเวลาด้วย <code>(julianday(b.tapped_at) - julianday(a.tapped_at)) * 24 * 60</code>",
    ],
    solution: `SELECT DISTINCT p.name, a.card_no
FROM transit_taps a
JOIN transit_taps b
  ON b.card_no = a.card_no
 AND b.station <> a.station
 AND b.tapped_at > a.tapped_at
 AND (julianday(b.tapped_at) - julianday(a.tapped_at)) * 24 * 60 < 5
JOIN transit_cards c ON c.card_no = a.card_no
JOIN people p ON p.id = c.owner_id;`,
    answerPersonId: 22,
  },
  {
    n: 15,
    title: "คืนที่ไล่ครบทุกสถานี",
    level: "COUNT(DISTINCT) · HAVING",
    brief:
      "รถไฟฟ้าเมืองนี้มี <b>5 สถานี</b> คืนก่อเหตุมีบัตรใบหนึ่งถูกแตะ <b>ครบทั้ง 5 สถานีภายในวันเดียว</b> ซึ่งไม่ใช่พฤติกรรมคนเดินทางปกติ",
    goal: "เจ้าของบัตรที่แตะครบทุกสถานีในวันเดียวชื่ออะไร?",
    tables: ["transit_taps", "transit_cards", "people"],
    starter: `SELECT card_no, date(tapped_at) AS day, COUNT(DISTINCT station) AS stations
FROM transit_taps
GROUP BY card_no, day;
-- เหลือกรองกลุ่มที่ stations = 5 แล้วตามหาชื่อเจ้าของบัตร`,
    hints: [
      "จับกลุ่มด้วยของสองอย่างพร้อมกันได้ — ที่นี่คือ “บัตรใบไหน” คู่กับ “วันไหน”",
      "<code>COUNT(DISTINCT station)</code> นับสถานีที่<b>ไม่ซ้ำกัน</b> ต่างจาก <code>COUNT(*)</code> ที่นับทุกครั้งที่แตะ",
      "จับกลุ่มด้วยบัตรและวันที่ <code>GROUP BY c.card_no, date(t.tapped_at)</code> แล้วนับสถานีที่ไม่ซ้ำด้วย <code>HAVING COUNT(DISTINCT t.station) = 5</code>",
    ],
    solution: `SELECT p.name, date(t.tapped_at) AS night, COUNT(DISTINCT t.station) AS stations
FROM transit_taps t
JOIN transit_cards c ON c.card_no = t.card_no
JOIN people p ON p.id = c.owner_id
GROUP BY p.id, p.name, night
HAVING COUNT(DISTINCT t.station) = 5;`,
    answerPersonId: 24,
  },
  {
    n: 16,
    title: "เงินก้อนที่ทะลุเพดานเป็นคนแรก",
    level: "Window function · ยอดสะสม",
    brief:
      "ฝ่ายการเงินส่งบัญชีเดินสะพัดมาให้ (<code>bank_transactions</code>) เราสนใจเฉพาะเงิน<b>โอนเข้า</b> (<code>kind = 'in'</code>) — อยากรู้ว่า<b>ใครเป็นคนแรก</b>ที่ยอดรับโอน<b>สะสม</b>ทะลุ <b>50,000 บาท</b>",
    goal: "คนแรกที่ยอดรับโอนสะสมทะลุ 50,000 บาท ชื่ออะไร?",
    tables: ["bank_transactions", "people"],
    starter: `SELECT person_id, tx_at, amount,
       SUM(amount) OVER (PARTITION BY person_id ORDER BY tx_at) AS total_so_far
FROM bank_transactions
WHERE kind = 'in';
-- total_so_far คือยอดสะสมของแต่ละคน เหลือหาแถวแรกที่ทะลุ 50000`,
    hints: [
      "กดรันดูคอลัมน์ <code>total_so_far</code> ก่อน — มันคือยอดที่ไล่บวกสะสมไปทีละแถวของแต่ละคน",
      "กรองด้วยคอลัมน์ที่คำนวณจาก <code>OVER (...)</code> ใน <code>WHERE</code> ตรง ๆ ไม่ได้ ต้องเอาคิวรีนี้ไปห่อใน <code>WITH ... AS ( ... )</code> ก่อน",
      "ยอดสะสมคือ <code>SUM(amount) OVER (PARTITION BY person_id ORDER BY tx_at)</code> — คำนวณใน CTE ก่อน แล้วค่อยกรอง <code>WHERE total_so_far &gt; 50000</code> แล้วเรียงตามเวลาเอาแถวแรก",
    ],
    solution: `WITH running AS (
  SELECT person_id, tx_at, amount,
         SUM(amount) OVER (PARTITION BY person_id ORDER BY tx_at) AS total_so_far
  FROM bank_transactions
  WHERE kind = 'in'
)
SELECT p.name, r.tx_at, r.total_so_far
FROM running r
JOIN people p ON p.id = r.person_id
WHERE r.total_so_far > 50000
ORDER BY r.tx_at
LIMIT 1;`,
    answerPersonId: 29,
  },
  {
    n: 17,
    title: "โอนซ้อนกันในสิบนาที",
    level: "LAG · เทียบกับแถวก่อนหน้า",
    brief:
      "ธนาคารแจ้งพฤติกรรมผิดปกติ: มีบัญชีหนึ่งรับโอนเงินเข้า <b>สองก้อนติดกันห่างกันไม่ถึง 10 นาที</b> ทั้งเมืองมีอยู่บัญชีเดียวที่เป็นแบบนี้",
    goal: "เจ้าของบัญชีนั้นชื่ออะไร?",
    tables: ["bank_transactions", "people"],
    starter: `SELECT person_id, tx_at,
       LAG(tx_at) OVER (PARTITION BY person_id ORDER BY tx_at) AS prev_at
FROM bank_transactions
WHERE kind = 'in';
-- prev_at คือเวลาโอนของแถวก่อนหน้า เหลือคิดส่วนต่างว่าห่างกันกี่นาที`,
    hints: [
      "อยากเทียบแถวนี้กับแถวก่อนหน้า ให้ “ดึง” ค่าของแถวก่อนหน้ามาไว้ในแถวเดียวกันก่อน",
      "ส่วนต่างเวลาเป็นนาที = <code>(julianday(tx_at) - julianday(prev_at)) * 24 * 60</code> และต้องกรอง <code>prev_at IS NOT NULL</code> ทิ้งแถวแรกของแต่ละคนออก",
      "<code>LAG(tx_at) OVER (PARTITION BY person_id ORDER BY tx_at)</code> ดึงเวลาโอนของแถวก่อนหน้ามาไว้ในแถวเดียวกัน แล้วค่อยคิดส่วนต่างเป็นนาที (จะใช้ SELF JOIN แบบคดีที่ 14 ก็ได้ผลเหมือนกัน)",
    ],
    solution: `WITH gaps AS (
  SELECT person_id, tx_at,
         LAG(tx_at) OVER (PARTITION BY person_id ORDER BY tx_at) AS prev_at
  FROM bank_transactions
  WHERE kind = 'in'
)
SELECT DISTINCT p.name
FROM gaps g
JOIN people p ON p.id = g.person_id
WHERE g.prev_at IS NOT NULL
  AND (julianday(g.tx_at) - julianday(g.prev_at)) * 24 * 60 < 10;`,
    answerPersonId: 32,
  },
  {
    n: 18,
    title: "สามเบาะแสที่ชี้ไปคนเดียวกัน",
    level: "CTE หลายชั้น",
    brief:
      "คืนวันที่ <b>11 มี.ค. 2026</b> มีของหายจากสถานีเมืองเก่า ผู้ต้องสงสัยต้องเข้าครบทั้งสามข้อ: <b>(1)</b> ซื้อโทรศัพท์ใช้แล้วทิ้ง (<code>item = 'burner phone'</code>) <b>(2)</b> รับโอนเงินเข้าก้อนเดียวเกิน <b>20,000 บาท</b> ตั้งแต่วันที่ 10 มี.ค. <b>(3)</b> แตะบัตรที่ <b>Old Town Station</b> คืนนั้น (20:00–02:00)",
    goal: "คนที่เข้าครบทั้งสามเงื่อนไขชื่ออะไร?",
    tables: ["purchases", "bank_transactions", "transit_taps", "transit_cards", "people"],
    starter: `SELECT DISTINCT person_id FROM purchases
WHERE item = 'burner phone';
-- นี่คือเงื่อนไขข้อ 1 — เขียนข้อ 2 และ 3 แบบเดียวกัน (คืน person_id อย่างเดียว) แล้วค่อย JOIN รวมกัน`,
    hints: [
      "อย่าพยายามเขียนรวดเดียว ทำทีละข้อให้แต่ละข้อคืนแค่ <code>person_id</code> แล้วดูว่า id ไหนโผล่ครบทั้งสามข้อ",
      "<code>WITH ชื่อ AS ( ... ), ชื่อ2 AS ( ... )</code> คือการตั้งชื่อให้คิวรีย่อย เอาไป <code>JOIN</code> ต่อได้เหมือนตารางปกติ",
      "แตกเป็นสามก้อนด้วย <code>WITH</code> ก้อนละเงื่อนไข ให้แต่ละก้อนคืน <code>person_id</code> อย่างเดียว แล้วค่อย <code>JOIN</code> ทั้งสามก้อนเข้าหากัน ใครอยู่ครบทั้งสามก้อนคือคำตอบ",
    ],
    solution: `WITH burner AS (
  SELECT DISTINCT person_id FROM purchases
  WHERE item = 'burner phone'
),
big_money AS (
  SELECT DISTINCT person_id FROM bank_transactions
  WHERE kind = 'in' AND amount > 20000 AND tx_at > '2026-03-10'
),
night_tap AS (
  SELECT DISTINCT c.owner_id AS person_id
  FROM transit_taps t
  JOIN transit_cards c ON c.card_no = t.card_no
  WHERE t.station = 'Old Town Station'
    AND t.tapped_at BETWEEN '2026-03-11 20:00' AND '2026-03-12 02:00'
)
SELECT p.name
FROM people p
JOIN burner b ON b.person_id = p.id
JOIN big_money m ON m.person_id = p.id
JOIN night_tap n ON n.person_id = p.id;`,
    answerPersonId: 35,
  },
  {
    n: 19,
    title: "ต้นสายของขบวนการ",
    level: "RECURSIVE CTE",
    brief:
      "{{name35}} รับสารภาพ และให้ตาราง <code>crew_links</code> มา — แต่ละแถวบอกว่า <b>ใครถูกใครชวนเข้ามา</b> (<code>recruited_by</code>) ไล่สายขึ้นไปจาก <code>person_id = 35</code> เรื่อย ๆ จนถึงคนที่<b>ไม่มีใครชวน</b> (<code>recruited_by IS NULL</code>) คนนั้นคือหัวหน้า",
    goal: "หัวหน้าขบวนการที่อยู่ต้นสายชื่ออะไร?",
    tables: ["crew_links", "people"],
    starter: `SELECT * FROM crew_links WHERE person_id = 35;
-- ได้เลขคนที่ชวน 35 มาแล้ว จะไล่มือทีละชั้นโดยเปลี่ยนเลข 35 เป็นเลขนั้นก็ได้
-- ถ้าอยากให้ SQL ไล่ให้เอง ใช้ WITH RECURSIVE`,
    hints: [
      "ลองไล่มือก่อนก็ได้: รันคิวรีตั้งต้น เห็น <code>recruited_by</code> เป็นเลขอะไร ก็เอาเลขนั้นไปใส่แทน 35 แล้วรันใหม่ ทำจนกว่าจะเจอค่าว่าง",
      "<code>WITH RECURSIVE</code> คือการบอกให้ SQL ทำซ้ำแบบนั้นเอง: แถวตั้งต้นหนึ่งก้อน <code>UNION ALL</code> กับก้อนที่ต่อจากผลลัพธ์ของตัวเอง",
      "เริ่มจากแถวของ <code>person_id = 35</code> แล้ววนขึ้นด้วย <code>UNION ALL</code> โดยต่อ <code>l.person_id = ch.recruited_by</code> ไปเรื่อย ๆ สุดท้ายกรองแถวที่ <code>recruited_by IS NULL</code>",
    ],
    solution: `WITH RECURSIVE chain AS (
  SELECT person_id, recruited_by FROM crew_links WHERE person_id = 35
  UNION ALL
  SELECT l.person_id, l.recruited_by
  FROM crew_links l
  JOIN chain ch ON l.person_id = ch.recruited_by
)
SELECT p.name
FROM chain c
JOIN people p ON p.id = c.person_id
WHERE c.recruited_by IS NULL;`,
    answerPersonId: 43,
  },
];

const nicknameOf = (fullName: string) => fullName.split(" ")[0];

/** แทน {{name<id>}} ในข้อความด้วยชื่อเล่นของคน id นั้นในรอบเล่นนี้ */
function resolveNames(text: string, names: string[]): string {
  return text.replace(/\{\{name(\d+)\}\}/g, (_match, idStr: string) => {
    const full = names[Number(idStr) - 1];
    return full ? nicknameOf(full) : _match;
  });
}

/**
 * ประกอบคดีทั้งหมดของรอบเล่นนี้จากชื่อคนและชื่อสถานที่ที่สุ่มมา
 * (names[i] = ชื่อคน id เท่ากับ i + 1)
 *
 * เรียกครั้งเดียวตอนเริ่มเกม เงื่อนไขของทุกคดียังอิงกับ id และโครงข้อมูลเดิมทุกอย่าง
 * เปลี่ยนแค่ "ป้ายชื่อ" ที่ผู้เล่นเห็น — ชื่อคน ชื่อสถานที่ และคำตอบที่ยอมรับ
 * ทุกข้อความที่ผู้เล่นเห็นต้องผ่าน applyPlaces ให้ครบ (รวมคิวรีตั้งต้นและคำใบ้ทุกใบ)
 * ไม่งั้นโจทย์จะอ้างถึงสถานที่ที่ไม่มีอยู่ในฐานข้อมูลของรอบนี้
 */
export function buildCases(names: string[], places: PlaceMap): DetectiveCase[] {
  const text = (value: string) => applyPlaces(resolveNames(value, names), places);

  return TEMPLATES.map(
    ({ answerPersonId, answers, brief, hints, goal, solution, starter, ...rest }) => {
      const accepted = (answers ?? []).map((answer) => applyPlaces(answer, places));
      if (answerPersonId != null) {
        const full = names[answerPersonId - 1];
        accepted.push(full, nicknameOf(full));
      }
      return {
        ...rest,
        brief: text(brief),
        hints: hints.map(text),
        goal: text(goal),
        starter: text(starter),
        solution: text(solution),
        answers: accepted,
      };
    },
  );
}

/** จำนวนคดีฝึกหัดที่อยู่หัวแถว ใช้โชว์ในหน้าแรก */
export const TUTORIAL_COUNT = TEMPLATES.filter((template) => template.tutorial).length;

/** ชุดคดีแบบชื่อตั้งต้น ใช้เฉพาะที่ไม่สนใจ brief/answers จริง (เช่น รายการคดีในหน้า Home) */
export const CASES: DetectiveCase[] = buildCases(DEFAULT_NAMES, DEFAULT_PLACES);
