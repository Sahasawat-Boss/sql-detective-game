"use client";

import { useEffect, useState } from "react";
import type { DetectiveCase } from "@/types";

type Panel = "none" | "hint" | "solution";

export default function Toolbox({ detectiveCase }: { detectiveCase: DetectiveCase }) {
  const [panel, setPanel] = useState<Panel>("none");

  useEffect(() => setPanel("none"), [detectiveCase.n]);

  return (
    <div className="paper on-paper mt-5">
      <div className="eyebrow">กล่องเครื่องมือ</div>

      <div className="flex flex-col gap-2">
        <button type="button" className="btn btn-paper" onClick={() => setPanel("hint")}>
          ขอคำใบ้
        </button>
        <button type="button" className="btn btn-paper" onClick={() => setPanel("solution")}>
          ดูเฉลยคิวรี
        </button>
      </div>

      {panel === "hint" && (
        <div
          className="mt-3 rounded-sm border-l-[3px] border-brass bg-white/30 px-3 py-2.5 text-sm"
          dangerouslySetInnerHTML={{ __html: detectiveCase.hint }}
        />
      )}

      {panel === "solution" && (
        <div className="mt-3 rounded-sm border-l-[3px] border-brass bg-white/30 px-3 py-2.5">
          <pre className="m-0 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed">
            {detectiveCase.solution}
          </pre>
        </div>
      )}
    </div>
  );
}
