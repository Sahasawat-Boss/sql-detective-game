/**
 * แปล error ของ SQLite เป็นภาษาที่มือใหม่อ่านแล้วรู้ว่าต้องไปแก้ตรงไหน
 * ข้อความดิบอย่าง "no such column: Name" ไม่ได้บอกคนเพิ่งเริ่มว่าต้องทำอะไรต่อ
 * ทุกกรณีที่แปลแล้วจึงต้องมีประโยคว่า "ให้ไปดู/ไปแก้ตรงไหน" ติดไปด้วยเสมอ
 * เคสที่ยังไม่ได้ครอบคลุมให้คืนข้อความเดิมไป ดีกว่าเดาผิดแล้วพาหลงทาง
 */
export function explainSqlError(message: string): string {
  const table = /no such table:\s*(\S+)/i.exec(message);
  if (table) {
    return `ไม่มีตารางชื่อ “${table[1]}” ในฐานข้อมูล — เช็คชื่อตารางที่มีจริงได้ที่แผง “ตารางในฐานข้อมูล” ทางขวา`;
  }

  const column = /no such column:\s*(\S+)/i.exec(message);
  if (column) {
    return `ไม่มีคอลัมน์ชื่อ “${column[1]}” — กดชื่อตารางในแผงทางขวาเพื่อดูคอลัมน์ทั้งหมด (ชื่อคอลัมน์เป็นตัวพิมพ์เล็กเสมอ เช่น hat_color) · ถ้าตั้งใจจะเทียบกับ “ข้อความ” ต้องใส่เครื่องหมาย ' ครอบ เช่น 'red'`;
  }

  const ambiguous = /ambiguous column name:\s*(\S+)/i.exec(message);
  if (ambiguous) {
    return `คอลัมน์ “${ambiguous[1]}” มีอยู่ในหลายตารางที่ JOIN กันอยู่ SQL เลยไม่รู้ว่าหมายถึงอันไหน — ระบุตารางนำหน้าด้วย เช่น p.${ambiguous[1]}`;
  }

  const near = /near "([^"]*)":\s*syntax error/i.exec(message);
  if (near) {
    return `คิวรีผิดไวยากรณ์ตรงใกล้ ๆ “${near[1]}” — มักเกิดจากสะกดคำสั่งผิด ลืมคอมมาคั่นคอลัมน์ หรือสลับลำดับคำสั่ง (ลำดับที่ถูกคือ SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT)`;
  }

  if (/incomplete input/i.test(message)) {
    return "คิวรียังไม่จบ — น่าจะลืมปิดวงเล็บ หรือลืมใส่เครื่องหมาย ' ปิดข้อความ";
  }

  const token = /unrecognized token:\s*(.+)$/i.exec(message);
  if (token) {
    return `มีตัวอักษรที่ SQL ไม่รู้จัก (${token[1]}) — เช็คว่าเผลอพิมพ์ภาษาไทยหรือเครื่องหมายแปลก ๆ ปนเข้าไปในคิวรีไหม`;
  }

  if (/misuse of aggregate/i.test(message)) {
    return "ใช้ COUNT / SUM ใน WHERE ไม่ได้ เพราะ WHERE ทำงานก่อนจะจัดกลุ่ม — เงื่อนไขที่คิดจากยอดรวมของกลุ่มต้องย้ายไปไว้ใน HAVING แทน";
  }

  if (/wrong number of arguments/i.test(message)) {
    return `ใส่ค่าในวงเล็บของฟังก์ชันไม่ครบหรือเกิน — เช็คอีกทีว่าฟังก์ชันนั้นต้องการกี่ค่า เช่น strftime('%H', seen_at) ต้องใส่สองค่า (${message})`;
  }

  return `คิวรีไม่ผ่าน: ${message}`;
}
