import Link from "next/link";
import GuideBook from "@/components/GuideBook";
import SiteNav from "@/components/SiteNav";
import { CASES, TUTORIAL_COUNT } from "@/data/cases";
import { GUIDE } from "@/data/guide";
import { schemaFromSeed } from "@/lib/schemaFromSeed";

const STEPS = [
  {
    n: 1,
    title: "เริ่มที่คดีฝึกหัด",
    text: `${TUTORIAL_COUNT} คดีแรกเป็นด่านฝึก สอนทีละคำสั่ง — เขียน SQL ไม่เป็นมาก่อนเลยก็เริ่มตรงนี้ได้`,
  },
  {
    n: 2,
    title: "กดรันคิวรีที่เตรียมไว้ให้",
    text: "ทุกคดีมีคิวรีตั้งต้นรออยู่ในคอนโซลแล้ว กดรัน (หรือ Ctrl + Enter) ดูผลก่อน แล้วค่อยแก้ต่อทีละบรรทัด",
  },
  {
    n: 3,
    title: "ตอบชื่อผู้ต้องสงสัย",
    text: "เจอคำตอบในตารางผลลัพธ์แล้วพิมพ์ลงช่องสรุปสำนวน ตอบถูกจะได้ตราปั๊ม “ปิดคดีแล้ว”",
  },
  {
    n: 4,
    title: "ติดตรงไหนก็เปิดคำใบ้",
    text: "กล่องเครื่องมือมีคำใบ้ให้เปิดทีละใบ ไล่จากชี้ทางคิดไปจนเกือบเฉลย — ยังไม่ไหวก็เปิดเฉลยคิวรีได้ ไม่ถือว่าโกง",
  },
];

export default function Page() {
  const schema = schemaFromSeed();
  const topics = GUIDE.reduce((sum, chapter) => sum + chapter.topics.length, 0);

  return (
    <>
      <SiteNav />

      <div className="mx-auto max-w-[1120px] px-4 pb-24 pt-10">
        {/* ---------- หัวเรื่อง ---------- */}
        <header
          className="text-center"
          style={{ animation: "drop .7s cubic-bezier(.2,.9,.3,1) both" }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[3.5px] text-brass/90">
            Minor Crimes Division · Los Zorangeles PD
          </div>
          <h1
            className="m-0 mt-2 font-display text-[clamp(30px,6.6vw,52px)] leading-tight tracking-wide"
            style={{ color: "#F5E9CC", textShadow: "0 2px 0 #0007, 0 0 34px #C99A3E55" }}
          >
            หน่วยสืบสวนฐานข้อมูล
          </h1>
          <p className="mx-auto mt-3 max-w-[56ch] text-[15.5px] text-[#C4AF87]">
            เกมไขคดีด้วยการเขียน SQL — {CASES.length} คดี เริ่มจาก {TUTORIAL_COUNT}{" "}
            คดีฝึกหัดที่แค่กดปุ่มรันก็ผ่าน แล้วไต่ไปจนถึง <code>JOIN</code> และ subquery
            ไม่ต้องติดตั้งฐานข้อมูล ไม่ต้องสมัครอะไร เปิดแล้วเล่นได้เลย
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/play" className="btn btn-lg">
              เริ่มเกม
            </Link>
            <a href="#guide" className="btn btn-ghost btn-lg">
              อ่านคู่มือ SQL ก่อน
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="chip chip-dark">เริ่มจากศูนย์ได้ · {TUTORIAL_COUNT} คดีฝึกหัด</span>
            <span className="chip chip-dark">{CASES.length} คดี</span>
            <span className="chip chip-dark">{schema.length} ตาราง</span>
            <span className="chip chip-dark">คู่มือ {GUIDE.length} บท · {topics} หัวข้อ</span>
            <span className="chip chip-dark">SQLite จริงในเบราว์เซอร์</span>
          </div>
        </header>

        {/* ---------- วิธีเล่น ---------- */}
        <section id="how-to-play" className="mt-14 scroll-mt-20">
          <h2 className="section-title">เล่นยังไง</h2>
          <p className="section-lead">
            ทำงานเหมือนนักสืบจริง — อ่านสำนวน หาของกลางจากฐานข้อมูล แล้วชี้ตัวคนร้าย
            ไม่ต้องท่องคำสั่งมาก่อน ค่อย ๆ เก็บทีละคดี
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="sheet">
                <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-stamp font-display text-[14px] text-stamp">
                  {step.n}
                </span>
                <h3 className="mb-1 mt-2.5 font-mono text-[14px] font-semibold">{step.title}</h3>
                <p className="m-0 text-[13.5px] text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- รายการคดี ---------- */}
        <section id="cases" className="mt-14 scroll-mt-20">
          <h2 className="section-title">สำนวนคดีทั้งหมด</h2>
          <p className="section-lead">
            เรียงจากง่ายไปยาก {TUTORIAL_COUNT} คดีแรกคือด่านฝึกที่สอน <code>SELECT</code>,{" "}
            <code>WHERE</code> และ <code>ORDER BY</code> ทีละคำสั่ง จากนั้นเป็นคดีจริงที่ไต่ไปจนถึง
            window function และ recursive CTE · คดีที่ 9–11 กับ 16–19 ต่อกันเป็นเนื้อเรื่องเดียว —
            คนที่ดูเหมือนผิดตอนแรก อาจจะโดนใส่ร้ายอยู่ก็ได้
          </p>

          <ol className="mt-5 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
            {CASES.map((detectiveCase) => (
              <li key={detectiveCase.n} className="sheet flex items-start gap-3 py-3.5">
                <span className="mt-0.5 font-display text-[19px] text-stamp">
                  {String(detectiveCase.n).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold leading-snug">{detectiveCase.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {detectiveCase.tutorial && <span className="chip">ฝึกหัด</span>}
                    <span className="chip">{detectiveCase.level}</span>
                    {detectiveCase.tables.map((table) => (
                      <span key={table} className="chip font-mono">
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- คู่มือ ---------- */}
        <div className="mt-14">
          <GuideBook />
        </div>

        {/* ---------- ตารางในฐานข้อมูล ---------- */}
        <section id="schema" className="mt-14 scroll-mt-20">
          <h2 className="section-title">ตารางในฐานข้อมูล</h2>
          <p className="section-lead">
            ฐานข้อมูลเมือง Los Zorangeles ที่ต้องค้นหาของกลาง — ในเกมมีแผงนี้อยู่ข้างคอนโซลด้วย
            ไม่ต้องจำชื่อคอลัมน์เอง แถมกดส่องข้อมูลจริง 5 แถวแรกของแต่ละตารางได้
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {schema.map((table) => (
              <div key={table.name} className="sheet">
                <div className="font-mono text-[13.5px] font-semibold">
                  <span className="text-stamp">▸</span> {table.name}
                </div>
                <div className="mt-1.5">
                  {table.columns.map((column) => (
                    <span
                      key={column}
                      className="mr-1 mt-1 inline-block rounded-sm border border-ink/20 bg-white/30 px-1.5 font-mono text-[11.5px] text-ink-soft"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 font-mono text-[12px] text-[#7C6A4C]">
            หมายเหตุ · โหมดนักสืบอ่านข้อมูลได้อย่างเดียว คิวรีที่มี INSERT / UPDATE / DELETE /
            DROP / ALTER จะถูกปัดตก
          </p>
        </section>

        {/* ---------- ปิดท้าย ---------- */}
        <section className="mt-14 text-center">
          <h2 className="section-title">พร้อมรับสำนวนแรกหรือยัง</h2>
          <p className="section-lead mx-auto">
            คดีฝึกหัดคดีแรกมีคิวรีเขียนรอไว้ให้แล้ว — กดปุ่ม “รันคิวรี” ก็เริ่มได้เลย
          </p>
          <div className="mt-5">
            <Link href="/play" className="btn btn-lg">
              เริ่มเกม
            </Link>
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-wider text-[#7C6A4C]">
            SQLite จริงในเบราว์เซอร์ · sql.js
          </p>
        </section>
      </div>
    </>
  );
}
