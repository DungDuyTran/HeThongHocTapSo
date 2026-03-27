import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function GET(req: Request) {
  try {
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const { searchParams } = new URL(req.url);
    const folderId = parseInt(searchParams.get("folderId") || "0");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Kiểm tra xem folder này có thuộc về user đang đăng nhập không [cite: 39]
    const folder = await prisma.flashcardFolder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Không tìm thấy thư mục" },
        { status: 404 },
      );
    }

    const allCards = await prisma.flashcard.findMany({
      where: { folderId },
      select: { id: true, front: true, back: true },
    });

    if (allCards.length < 4) {
      return NextResponse.json(
        { error: "Cần tối thiểu 4 thẻ" },
        { status: 400 },
      );
    }

    const quizData = allCards.map((card) => {
      const otherAnswers = allCards
        .filter((c) => c.id !== card.id)
        .map((c) => c.back.trim());

      const distractors = shuffle(otherAnswers).slice(0, 3);
      const options = shuffle([card.back.trim(), ...distractors]);

      return {
        id: card.id,
        front: card.front,
        back: card.back.trim(),
        options,
      };
    });

    return NextResponse.json(shuffle(quizData));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
