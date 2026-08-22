import type { QueryResult } from "@/types";

const cell = (v: QueryResult["values"][number][number]) =>
  v === null ? "NULL" : String(v);

export default function ResultTable({ result }: { result: QueryResult }) {
  return (
    <div className="max-h-[330px] overflow-auto rounded-[3px] border border-white/10">
      <table className="w-full border-collapse bg-[#12100A] font-mono text-[12.5px] text-term-fg">
        <thead>
          <tr>
            {result.columns.map((col) => (
              <th
                key={col}
                className="sticky top-0 whitespace-nowrap border-b border-white/10 bg-[#241B10] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-brass"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, i) => (
            <tr key={i} className="hover:bg-white/5">
              {row.map((v, j) => (
                <td key={j} className="whitespace-nowrap border-b border-white/10 px-3 py-1.5">
                  {cell(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
