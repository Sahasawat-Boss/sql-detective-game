import { GUIDE } from "@/data/guide";
import type { GuideChapter, GuideTopic } from "@/types";
import SqlBlock from "./SqlBlock";

/** คู่มือคำสั่ง SQL ทั้งเล่ม — สารบัญด้านซ้าย เนื้อหาด้านขวา */
export default function GuideBook() {
  return (
    <section id="guide" className="scroll-mt-20">
      <h2 className="section-title">คู่มือคำสั่ง SQL</h2>
      <p className="section-lead">
        เรียงจากง่ายไปยาก ทุกตัวอย่างรันได้จริงกับฐานข้อมูลเมือง Los Zorangeles ที่ใช้ในเกม —
        กดหัวข้อเพื่อกางเนื้อหา แล้วกดปุ่มคัดลอกไปวางในคอนโซลได้เลย
      </p>
      <p className="section-lead mt-2">
        <b>หมายเหตุ:</b> เกมสุ่ม<b>ชื่อคน</b>และ<b>ชื่อสถานที่</b>ใหม่ทุกรอบเล่น เพื่อไม่ให้จำคำตอบเดิมได้
        ชื่อที่โผล่ในตัวอย่างและในช่อง &ldquo;ผลลัพธ์ที่ควรได้&rdquo; จึงเป็นของเมืองชุดตั้งต้น
        ส่วนโครงสร้างตาราง จำนวนแถว และตรรกะของคิวรีเหมือนกันทุกรอบ — ถ้าตัวอย่างไหนอ้างชื่อเขตหรือสถานที่
        ให้เช็คชื่อของรอบนั้นก่อนด้วย <code>SELECT DISTINCT district FROM people;</code> แล้วแทนค่าลงไป
      </p>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[232px_1fr]">
        <nav className="sheet lg:sticky lg:top-[68px]" aria-label="สารบัญคู่มือ">
          <div className="eyebrow">สารบัญ</div>
          <ol className="m-0 list-none space-y-1 p-0">
            {GUIDE.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#guide-${chapter.id}`}
                  className="flex items-baseline gap-2 rounded-[3px] px-1.5 py-1 text-[13px] hover:bg-white/40"
                >
                  <span className="font-mono text-[11px] text-stamp">
                    {String(chapter.n).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{chapter.title}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-dashed border-ink/20 pt-2.5 text-[12px] text-ink-soft">
            บทที่ 1–4 คือของที่ใช้จริงเกือบทุกวัน ส่วนบทที่ 6–8 ไว้อ่านตอนต้องทำรายงาน
          </p>
        </nav>

        <div className="space-y-5">
          {GUIDE.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chapter({ chapter }: { chapter: GuideChapter }) {
  return (
    <article id={`guide-${chapter.id}`} className="sheet scroll-mt-[76px]">
      <div className="eyebrow">
        บทที่ {String(chapter.n).padStart(2, "0")} · {chapter.level}
      </div>
      <h3 className="paper-title">{chapter.title}</h3>
      <p className="m-0 text-[14.5px] text-ink-soft">{chapter.summary}</p>

      {chapter.cases.length > 0 && (
        <p className="mt-2.5 text-[12.5px] text-ink-soft">
          ได้ใช้ในสำนวนที่{" "}
          <b>{chapter.cases.map((n) => String(n).padStart(2, "0")).join(" · ")}</b>
        </p>
      )}

      <div className="mt-3.5 space-y-2.5">
        {chapter.topics.map((topic, i) => (
          <Topic key={topic.id} topic={topic} defaultOpen={chapter.n === 1 && i === 0} />
        ))}
      </div>
    </article>
  );
}

function Topic({ topic, defaultOpen }: { topic: GuideTopic; defaultOpen: boolean }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-sm border border-ink/20 bg-white/25 px-3.5 py-2.5"
    >
      <summary className="flex cursor-pointer list-none items-baseline gap-2 marker:hidden">
        <span className="font-mono text-[12px] text-stamp transition-transform group-open:rotate-90">
          ▸
        </span>
        <span className="flex-1">
          <span className="font-mono text-[13.5px] font-semibold">{topic.title}</span>
          <span className="mt-0.5 block text-[13px] text-ink-soft">{topic.what}</span>
        </span>
      </summary>

      <div className="mt-3 pl-[18px]">
        <div className="mb-3 border-l-[3px] border-brass bg-white/40 px-3 py-1.5 font-mono text-[12.5px] text-ink-soft">
          {topic.syntax}
        </div>

        <div className="space-y-4">
          {topic.examples.map((example) => (
            <div key={example.label}>
              <div className="mb-1.5 text-[13.5px] font-semibold">{example.label}</div>
              <SqlBlock sql={example.sql} />
              <p
                className="mb-0 mt-2 text-[13.5px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: example.explain }}
              />
              {example.output && (
                <p className="m-0 mt-1 font-mono text-[12px] text-ink-soft">
                  ผลลัพธ์ → {example.output}
                </p>
              )}
            </div>
          ))}
        </div>

        {topic.pitfalls && topic.pitfalls.length > 0 && (
          <div className="mt-4 rounded-sm border-l-[3px] border-stamp bg-stamp/10 px-3 py-2.5">
            <div className="eyebrow mb-1">กับดักที่เจอบ่อย</div>
            <ul className="m-0 list-disc space-y-1 pl-4 text-[13px]">
              {topic.pitfalls.map((pitfall) => (
                <li key={pitfall} dangerouslySetInnerHTML={{ __html: pitfall }} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
