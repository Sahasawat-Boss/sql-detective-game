"use client";

import type { TableSchema } from "@/types";

/**
 * รายการตารางทั้งหมด กางอัตโนมัติเฉพาะตารางที่เกี่ยวกับคดีปัจจุบัน
 * แต่ละตารางมีปุ่มส่องข้อมูลจริง เพราะรายชื่อคอลัมน์เฉย ๆ ยังบอกไม่ได้ว่า
 * ค่าข้างในหน้าตายังไง (เช่น hat_color เก็บว่า 'red' ไม่ใช่ 'แดง')
 */
export default function SchemaPanel({
  schema,
  highlight,
  onPeek,
}: {
  schema: TableSchema[];
  highlight: string[];
  /** ขอวางคิวรีส่องข้อมูลลงคอนโซล */
  onPeek: (sql: string) => void;
}) {
  return (
    <div className="paper on-paper">
      <div className="eyebrow">ตารางในฐานข้อมูล</div>

      {schema.length === 0 && <p className="text-sm text-ink-soft">กำลังอ่านโครงสร้าง…</p>}

      {schema.map((table) => {
        const related = highlight.includes(table.name);
        return (
          <details
            key={table.name}
            open={related}
            className="border-t border-dashed border-ink/20 py-2 first:border-t-0"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-[13px] font-semibold marker:hidden">
              <span className="text-stamp">▸</span>
              {table.name}
              {related && <span className="text-[11px] text-stamp">★</span>}
            </summary>
            <div className="mt-1.5 pl-4">
              {table.columns.map((col) => (
                <span
                  key={col}
                  className="mr-1 mt-1 inline-block rounded-sm border border-ink/20 bg-white/30 px-1.5 font-mono text-[11.5px] text-ink-soft"
                >
                  {col}
                </span>
              ))}
              <button
                type="button"
                className="btn btn-paper mt-2 block px-2 py-1 text-[11.5px]"
                onClick={() => onPeek(`SELECT * FROM ${table.name} LIMIT 5;`)}
              >
                ส่องข้อมูล 5 แถวแรก
              </button>
            </div>
          </details>
        );
      })}

      <p className="mb-0 mt-3 border-t border-dashed border-ink/20 pt-2.5 text-[12px] leading-relaxed text-ink-soft">
        ไม่ต้องจำชื่อคอลัมน์ เปิดดูตรงนี้ได้ตลอด · ★ คือตารางที่คดีนี้น่าจะได้ใช้
      </p>
    </div>
  );
}
