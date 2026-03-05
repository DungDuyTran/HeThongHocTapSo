import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FlashcardRepository } from "@/lib/api/repositories/FlashcardRepository";

const flashcardRepo = new FlashcardRepository();

export async function GET(req: Request) {
  try {
    const userId = parseInt(req.headers.get("x-user-id") || "1"); // Lấy từ Middleware
    const history = await flashcardRepo.getHistory(userId);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    // Công thức tính điểm chuyên nghiệp:
    // $Score = (Correct / Total) * 100$
    const scorePercent = (body.correct / body.total) * 100;

    const history = await prisma.flashcardHistory.create({
      data: {
        score: scorePercent,
        totalQuestions: body.total,
        correctAnswers: body.correct,
        timeSpent: body.time, // Tính bằng giây
        folderId: body.folderId,
        userId: userId,
      },
    });
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
