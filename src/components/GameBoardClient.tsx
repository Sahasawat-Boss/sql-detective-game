"use client";

import dynamic from "next/dynamic";

/**
 * ตัวเกมทำงานฝั่งเบราว์เซอร์ล้วน — ทั้ง sql.js (wasm) และการสุ่มชื่อคน/ชื่อสถานที่รายรอบ
 *
 * ต้องปิด SSR ไปเลย ไม่งั้นฝั่งเซิร์ฟเวอร์จะ prerender ด้วยชื่อที่สุ่มได้คนละชุดกับฝั่งเบราว์เซอร์
 * แล้วเกิด hydration mismatch (React ทิ้ง HTML จากเซิร์ฟเวอร์แล้วเรนเดอร์ใหม่ + ขึ้น error เต็มคอนโซล)
 * การ prerender หน้านี้ไม่ได้ประโยชน์อยู่แล้วเพราะทุกอย่างรอ wasm โหลดเสร็จก่อน
 */
const GameBoard = dynamic(() => import("./GameBoard"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-[1120px] px-4 pt-20 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[3px] text-brass/80">
        กำลังเปิดแฟ้มคดี…
      </p>
    </div>
  ),
});

export default function GameBoardClient() {
  return <GameBoard />;
}
