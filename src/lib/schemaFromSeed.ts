import { SEED_SQL } from "@/data/seed";
import type { TableSchema } from "@/types";

const CREATE_TABLE = /CREATE TABLE (\w+)\s*\(([\s\S]*?)\);/g;

/**
 * อ่านชื่อตาราง/คอลัมน์จาก SEED_SQL ตรง ๆ โดยไม่ต้องโหลด wasm
 * ใช้ในหน้า Home ที่เรนเดอร์ฝั่งเซิร์ฟเวอร์ (SchemaPanel ในเกมยังอ่านจาก DB จริง)
 */
export function schemaFromSeed(): TableSchema[] {
  const tables: TableSchema[] = [];

  for (const [, name, body] of SEED_SQL.matchAll(CREATE_TABLE)) {
    const columns = body
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);
    tables.push({ name, columns });
  }

  return tables;
}
