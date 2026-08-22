/** แถบไฟบอกจำนวนคดีที่ปิดแล้ว */
export default function ProgressMeter({
  total,
  solved,
}: {
  total: number;
  solved: Set<number>;
}) {
  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className="h-[7px] w-[26px] -skew-x-[22deg] border border-brass/50 transition-all duration-300"
          style={
            solved.has(i)
              ? { background: "var(--brass)", boxShadow: "0 0 12px #C99A3E99" }
              : { background: "#00000040" }
          }
        />
      ))}
      <span className="ml-2.5 font-mono text-[11px] tracking-widest text-brass">
        {solved.size} / {total} ปิดคดี
      </span>
    </div>
  );
}
