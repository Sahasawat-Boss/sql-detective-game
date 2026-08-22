"use client";

import { useDatabase } from "@/hooks/useDatabase";
import { useGame } from "@/hooks/useGame";
import CaseFile from "./CaseFile";
import CaseTabs from "./CaseTabs";
import Header from "./Header";
import Message from "./Message";
import QueryConsole from "./QueryConsole";
import SchemaPanel from "./SchemaPanel";
import Toolbox from "./Toolbox";
import VerdictCard from "./VerdictCard";

export default function GameBoard() {
  const { db, schema, loading, error } = useDatabase();
  const game = useGame();
  const { current, currentIndex, cases, solved, isSolved, allSolved, goTo, submitAnswer } = game;

  return (
    <div className="mx-auto max-w-[1120px] px-4 pb-24 pt-7">
      <Header total={cases.length} solved={solved} />

      {error && (
        <div className="mb-4">
          <Message tone="error">
            โหลดฐานข้อมูลไม่สำเร็จ: {error} — ตรวจว่ามีไฟล์ public/sql-wasm.wasm แล้วรัน{" "}
            <code>npm install</code> อีกครั้ง
          </Message>
        </div>
      )}

      <CaseTabs cases={cases} currentIndex={currentIndex} solved={solved} onSelect={goTo} />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_322px]">
        <main>
          <CaseFile detectiveCase={current} solved={isSolved} />

          <QueryConsole
            db={db}
            resetKey={current.n}
            placeholderNote={
              loading
                ? "กำลังโหลดฐานข้อมูล…"
                : `ตารางที่น่าจะได้ใช้: ${current.tables.join(", ")}`
            }
          />

          <VerdictCard
            goal={current.goal}
            allSolved={allSolved}
            resetKey={current.n}
            onSubmit={submitAnswer}
          />
        </main>

        <aside>
          <SchemaPanel schema={schema} highlight={current.tables} />
          <Toolbox detectiveCase={current} />
        </aside>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] tracking-wider text-[#7C6A4C]">
        SQLite จริงในเบราว์เซอร์ · sql.js
      </p>
    </div>
  );
}
