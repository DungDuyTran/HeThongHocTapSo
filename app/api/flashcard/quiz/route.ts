import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = parseInt(searchParams.get("folderId") || "0");

  const allCards = await prisma.flashcard.findMany({
    where: { folderId },
    select: { id: true, front: true, back: true }, // Chỉ lấy field cần thiết để nhẹ máy
  });

  if (allCards.length < 5) {
    return NextResponse.json({ error: "Need 5 cards" }, { status: 400 });
  }

  // Logic trộn ngay tại Server
  const quizData = allCards
    .map((card) => {
      const others = allCards
        .filter((c) => c.id !== card.id)
        .map((c) => c.back);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [card.back, ...distractors].sort(
        () => Math.random() - 0.5,
      );

      return {
        id: card.id,
        front: card.front,
        back: card.back,
        options,
      };
    })
    .sort(() => Math.random() - 0.5);

  return NextResponse.json(quizData);
}
