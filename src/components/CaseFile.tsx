import type { DetectiveCase } from "@/types";

/** ลูปการเล่นสามขั้น โชว์เฉพาะคดีฝึกหัด — พอจับทางได้แล้วก็ไม่ต้องเกะกะอีก */
const HOW_TO_PLAY = [
  "แก้/เขียนคิวรีในคอนโซลสีดำ แล้วกด “รันคิวรี”",
  "อ่านคำตอบจากตารางผลลัพธ์ที่โผล่ขึ้นมา",
  "พิมพ์คำตอบลงช่อง “สรุปสำนวน” ใต้คอนโซล",
];

/** แผงสำนวนคดี — brief มี HTML tag พื้นฐานจากไฟล์ cases.ts ซึ่งเป็นเนื้อหาของเราเอง */
export default function CaseFile({
  detectiveCase,
  solved,
}: {
  detectiveCase: DetectiveCase;
  solved: boolean;
}) {
  const { n, title, level, brief, goal, tutorial } = detectiveCase;

  return (
    <section key={n} className="paper on-paper rounded-tl-none">
      {solved && <div className="stamp-mark">ปิดคดีแล้ว</div>}

      <div className="eyebrow">
        {tutorial ? "ฝึกหัด" : "สำนวน"}ที่ {String(n).padStart(2, "0")} · {level}
      </div>
      <h2 className="paper-title">{title}</h2>

      <div
        className="my-3.5 border-l-[3px] border-stamp py-0.5 pl-3.5"
        dangerouslySetInnerHTML={{ __html: brief }}
      />

      <div className="mt-3 flex items-start gap-2 font-semibold">
        <span
          className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 border-stamp font-display text-[13px] text-stamp"
          aria-hidden
        >
          ?
        </span>
        {goal}
      </div>

      {tutorial && (
        <div className="mt-3.5 rounded-sm border border-dashed border-ink/25 bg-white/25 px-3.5 py-3">
          <div className="eyebrow mb-1.5">เล่นยังไง — สามขั้นเท่านั้น</div>
          <ol className="m-0 list-none space-y-1 p-0 text-[13px]">
            {HOW_TO_PLAY.map((step, index) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-px font-mono text-[11px] font-semibold text-stamp">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mb-0 mt-2 text-[12px] text-ink-soft">
            เขียน SQL ไม่เป็นเลยก็ไม่เป็นไร — คิวรีตั้งต้นเตรียมไว้ให้แล้วในคอนโซล
            และกล่องเครื่องมือทางขวามีคำใบ้ทีละขั้น
          </p>
        </div>
      )}
    </section>
  );
}
