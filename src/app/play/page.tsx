import type { Metadata } from "next";
import GameBoardClient from "@/components/GameBoardClient";

export const metadata: Metadata = {
  title: "เล่นเกม — หน่วยสืบสวนฐานข้อมูล",
};

export default function PlayPage() {
  return <GameBoardClient />;
}
