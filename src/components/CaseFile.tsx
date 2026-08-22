import type { DetectiveCase } from "@/types";

/** แผงสำนวนคดี — brief มี HTML tag พื้นฐานจากไฟล์ cases.ts ซึ่งเป็นเนื้อหาของเราเอง */
export default function CaseFile({
  detectiveCase,
  solved,
}: {
  detectiveCase: DetectiveCase;
  solved: boolean;
}) {
  const { n, title, level, brief, goal } = detectiveCase;

  return (
    <section key={n} className="paper on-paper rounded-tl-none">
      {solved && <div className="stamp-mark">ปิดคดีแล้ว</div>}

      <div className="eyebrow">
        สำนวนที่ {String(n).padStart(2, "0")} · {level}
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
    </section>
  );
}
