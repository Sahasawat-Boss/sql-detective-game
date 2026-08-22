const FORBIDDEN = /\b(drop|delete|update|insert|alter|attach|pragma\s+writable)\b/i;

/**
 * เกมนี้ให้อ่านข้อมูลอย่างเดียว กันเผลอแก้ฐานข้อมูลระหว่างฝึก
 * @returns ข้อความเตือน ถ้าคิวรีไม่ผ่าน / null ถ้าผ่าน
 */
export function checkReadOnly(sql: string): string | null {
  if (!sql.trim()) return "ยังไม่ได้พิมพ์คิวรี";
  if (FORBIDDEN.test(sql)) return "โหมดนักสืบอ่านข้อมูลได้อย่างเดียว ใช้ SELECT เท่านั้น";
  return null;
}
