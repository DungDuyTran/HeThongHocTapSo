import { NextResponse } from "next/server";
import { TodoService } from "@/lib/api/service/TodoService";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await TodoService.getTodos(userId, date);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("LỖI API TODO GET:", err.message);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await TodoService.saveTodo(userId, body);
    if (data) {
      // Lấy tên user để hiện lên Dashboard 
      const user = await prisma.user.findUnique({ 
        where: { id: userId }, 
        select: { hoTen: true } 
      });
      await prisma.auditLog.create({
        data: {
          userId: userId,
          userName: user?.hoTen || "Học viên",
          action: "THÊM CÔNG VIỆC",
          table: "todo",
          detail: `Đã thêm công việc mới: ${data.title}`,
          type: "CREATE",
        }
      });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("LỖI API TODO POST:", err.message);
    return NextResponse.json(
      { error: "Không thể tạo nhiệm vụ" },
      { status: 500 },
    );
  }
}
