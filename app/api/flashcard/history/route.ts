import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Đảm bảo import đồng nhất

export async function GET(req: Request) {
  try {
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const history = await prisma.flashcardHistory.findMany({
      where: { userId },
      include: {
        folder: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      folderId,
      correctAnswers,
      totalQuestions,
      timeSpent,
      score,
      details,
    } = body;

    const finalScore = totalQuestions > 0 ? score : 0;

    const history = await prisma.flashcardHistory.create({
      data: {
        userId,
        folderId: parseInt(folderId),
        correctAnswers: correctAnswers || 0,
        totalQuestions: totalQuestions || 0,
        score: finalScore || 0,
        timeSpent: timeSpent || 0,
        details: details || null, // LƯU CHI TIẾT BÀI LÀM VÀO ĐÂY
      },
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Lỗi lưu lịch sử:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
