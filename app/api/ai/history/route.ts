import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json([], { status: 400 });

    const history = await prisma.chatHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "asc" },
      take: 20, // Lấy 20 câu gần nhất cho nhẹ trang
    });

    // Format lại dữ liệu cho khớp với State của Frontend
    const formattedHistory = history.map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.message,
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}