"use client";

import { useMemo, useState } from "react";
import { buildCases } from "@/data/cases";
import { pickSessionPlaces } from "@/data/places";
import { buildSeedSql, pickSessionNames } from "@/data/seed";
import { useDatabase } from "@/hooks/useDatabase";
import { useGame } from "@/hooks/useGame";
import { useNotes } from "@/hooks/useNotes";
import CaseFile from "./CaseFile";
import CaseTabs from "./CaseTabs";
import Header from "./Header";
import Message from "./Message";
import NotebookDrawer from "./NotebookDrawer";
import QueryConsole from "./QueryConsole";
import SchemaPanel from "./SchemaPanel";
import Toolbox from "./Toolbox";
import VerdictCard from "./VerdictCard";

export default function GameBoard() {
  // สุ่มชื่อคนและชื่อสถานที่ใหม่ทุกครั้งที่เริ่มเกม (mount ครั้งเดียวต่อรอบเล่น)
  // กันผู้เล่นจำคำตอบจากรอบก่อน ไม่ว่าคดีนั้นจะตอบเป็นชื่อคนหรือชื่อสถานที่
  const [names] = useState(() => pickSessionNames());
  const [places] = useState(() => pickSessionPlaces());
  const seedSql = useMemo(() => buildSeedSql(names, places), [names, places]);
  const cases = useMemo(() => buildCases(names, places), [names, places]);

  const { db, schema, loading, error } = useDatabase(seedSql);
  const game = useGame(cases);
  const { current, currentIndex, solved, isSolved, allSolved, goTo, submitAnswer } = game;

  // สมุดบันทึกไม่ผูกกับรอบเล่น อยู่ข้ามคดีและข้ามการรีเฟรชหน้า
  const { notes, addNote, updateNote, removeNote, clearNotes } = useNotes();
  const [insertRequest, setInsertRequest] = useState<{ sql: string } | null>(null);

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
            starter={current.starter}
            placeholderNote={
              loading
                ? "กำลังโหลดฐานข้อมูล…"
                : `กด “รันคิวรี” เพื่อดูผลลัพธ์ · ตารางที่น่าจะได้ใช้: ${current.tables.join(", ")}`
            }
            insertRequest={insertRequest}
            onSaveQuery={(sql) => addNote(sql, current.n, "query")}
          />

          <VerdictCard
            goal={current.goal}
            allSolved={allSolved}
            resetKey={current.n}
            onSubmit={submitAnswer}
          />
        </main>

        <aside>
          <SchemaPanel
            schema={schema}
            highlight={current.tables}
            onPeek={(sql) => setInsertRequest({ sql })}
          />
          <Toolbox detectiveCase={current} />
        </aside>
      </div>

      <p className="mt-8 text-center font-mono text-[11px] tracking-wider text-[#7C6A4C]">
        SQLite จริงในเบราว์เซอร์ · sql.js
      </p>

      <NotebookDrawer
        notes={notes}
        currentCaseN={current.n}
        onAdd={addNote}
        onUpdate={updateNote}
        onRemove={removeNote}
        onClearAll={clearNotes}
        onInsert={(sql) => setInsertRequest({ sql })}
      />
    </div>
  );
}
