import Link from "next/link";
import ProgressMeter from "./ProgressMeter";

export default function Header({
  total,
  solved,
}: {
  total: number;
  solved: Set<number>;
}) {
  return (
    <header className="mb-7 text-center" style={{ animation: "drop .7s cubic-bezier(.2,.9,.3,1) both" }}>
      <div className="mb-3 flex items-center justify-center gap-1">
        <Link href="/" className="nav-link">
          ← หน้าแรก
        </Link>
        <Link href="/#guide" className="nav-link">
          คู่มือ SQL
        </Link>
      </div>

      <h1
        className="m-0 font-display text-[clamp(26px,5.4vw,40px)] tracking-wide"
        style={{ color: "#F5E9CC", textShadow: "0 2px 0 #0007, 0 0 34px #C99A3E55" }}
      >
        หน่วยสืบสวนฐานข้อมูล
      </h1>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[3.5px] text-brass/90">
        Minor Crimes Division · Los Zorangeles PD
      </div>
      <ProgressMeter total={total} solved={solved} />
    </header>
  );
}
