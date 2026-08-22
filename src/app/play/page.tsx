import type { Metadata } from "next";
import GameBoard from "@/components/GameBoard";

export const metadata: Metadata = {
  title: "เล่นเกม — หน่วยสืบสวนฐานข้อมูล",
};

export default function PlayPage() {
  return <GameBoard />;
}
