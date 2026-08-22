import type { TableSchema } from "@/types";

/** รายการตารางทั้งหมด กางอัตโนมัติเฉพาะตารางที่เกี่ยวกับคดีปัจจุบัน */
export default function SchemaPanel({
  schema,
  highlight,
}: {
  schema: TableSchema[];
  highlight: string[];
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
            </div>
          </details>
        );
      })}
    </div>
  );
}
