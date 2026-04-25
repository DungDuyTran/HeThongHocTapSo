import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

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
      include: {
        folder: { select: { name: true } },
        user: { select: { hoTen: true } }
      }
    });
    if (history) {
      await prisma.auditLog.create({
        data: {
          userId,
          userName: history.user.hoTen || "Học viên",
          action: "HOÀN THÀNH QUIZ",
          table: "flashcardhistory",
          detail: `Đã làm xong bài test "${history.folder.name}" - Điểm: ${finalScore}%`,
          type: "INFO",
        },
      });
      let evalMsg = "";
      let notifyType: "SUCCESS" | "WARN" | "INFO" = "INFO";

      if (finalScore >= 80) {
        evalMsg = `Xuất sắc! Bạn đạt ${finalScore}% ở bộ thẻ "${history.folder.name}". Phong độ đỉnh cao!`;
        notifyType = "SUCCESS";
      } else if (finalScore >= 50) {
        evalMsg = `Tốt! Bạn đạt ${finalScore}% ở bộ thẻ "${history.folder.name}". Cố gắng chút nữa là thuộc hết rồi!`;
        notifyType = "SUCCESS";
      } else {
        evalMsg = `Kết quả: ${finalScore}% ở bộ thẻ "${history.folder.name}". Đừng nản, luyện tập thêm vài lần sẽ nhớ ngay!`;
        notifyType = "WARN";
      }
    }
    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Lỗi lưu lịch sử:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
