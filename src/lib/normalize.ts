/** ตัดช่องว่างเกินและแปลงเป็นตัวพิมพ์เล็ก ใช้เทียบคำตอบ */
export const normalize = (value: string): string =>
  value.replace(/\s+/g, " ").trim().toLowerCase();

/** ตรวจว่าคำตอบที่พิมพ์มาตรงกับคำตอบที่ยอมรับข้อใดข้อหนึ่งไหม */
export const matchesAnswer = (input: string, accepted: string[]): boolean =>
  accepted.some((answer) => normalize(answer) === normalize(input));
