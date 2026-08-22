import Link from "next/link";

/** แถบนำทางบนสุดของหน้า Home */
export default function SiteNav() {
  return (
    <div className="top-nav">
      <div className="mx-auto flex max-w-[1120px] items-center gap-1 px-4 py-2.5">
        <Link
          href="/"
          className="font-display text-[15px] tracking-wide text-[#F5E9CC] hover:text-white"
        >
          หน่วยสืบสวนฐานข้อมูล
        </Link>

        <nav className="ml-auto flex items-center gap-0.5">
          <a href="#how-to-play" className="nav-link hidden sm:inline-block">
            วิธีเล่น
          </a>
          <a href="#cases" className="nav-link hidden md:inline-block">
            คดีทั้งหมด
          </a>
          <a href="#guide" className="nav-link">
            คู่มือ SQL
          </a>
          <a href="#schema" className="nav-link hidden sm:inline-block">
            ตาราง
          </a>
          <Link href="/play" className="btn ml-2">
            เริ่มเกม
          </Link>
        </nav>
      </div>
    </div>
  );
}
