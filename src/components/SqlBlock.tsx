"use client";

import { useState } from "react";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "NULL", "IS", "IN", "LIKE",
  "BETWEEN", "ORDER", "GROUP", "BY", "HAVING", "LIMIT", "OFFSET", "JOIN",
  "LEFT", "RIGHT", "INNER", "OUTER", "CROSS", "ON", "AS", "DISTINCT", "INSERT",
  "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "INDEX",
  "VIEW", "WITH", "RECURSIVE", "UNION", "ALL", "CASE", "WHEN", "THEN", "ELSE",
  "END", "EXISTS", "OVER", "PARTITION", "ASC", "DESC", "BEGIN", "COMMIT",
  "ROLLBACK", "EXPLAIN", "QUERY", "PLAN", "PRIMARY", "KEY", "DROP", "ALTER",
];

const FUNCTIONS = [
  "COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "COALESCE", "DATE", "STRFTIME",
  "JULIANDAY", "RANK", "DENSE_RANK", "ROW_NUMBER", "LOWER", "UPPER", "LENGTH",
  "SUBSTR", "CAST", "IFNULL",
];

/** คอมเมนต์ | ข้อความ | คีย์เวิร์ด | ฟังก์ชัน | ตัวเลข */
const TOKEN = new RegExp(
  [
    "(--[^\\n]*)",
    "('(?:[^']|'')*')",
    `\\b(${KEYWORDS.join("|")})\\b`,
    `\\b(${FUNCTIONS.join("|")})\\b`,
    "\\b(\\d+(?:\\.\\d+)?)\\b",
  ].join("|"),
  "gi",
);

const CLASS_OF_GROUP = ["tok-comment", "tok-str", "tok-kw", "tok-fn", "tok-num"];

/** ระบายสีคิวรีแบบง่าย ๆ ไม่ต้องพึ่งไลบรารีภายนอก */
function highlight(sql: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const m of sql.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) nodes.push(sql.slice(last, at));

    const groupIndex = m.slice(1).findIndex(Boolean);
    nodes.push(
      <span key={`${at}-${m[0]}`} className={CLASS_OF_GROUP[groupIndex]}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }

  if (last < sql.length) nodes.push(sql.slice(last));
  return nodes;
}

export default function SqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* เบราว์เซอร์ไม่ให้สิทธิ์คลิปบอร์ด — ผู้ใช้ลากเลือกเองได้ */
    }
  };

  return (
    <div className="sql-block group">
      <button
        type="button"
        onClick={copy}
        className="btn btn-ghost absolute right-2 top-2 z-10 px-2 py-1 text-[11px] opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100"
        aria-label="คัดลอกคิวรี"
      >
        {copied ? "คัดลอกแล้ว" : "คัดลอก"}
      </button>
      <pre>{highlight(sql)}</pre>
    </div>
  );
}
