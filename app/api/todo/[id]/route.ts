import { NextResponse } from "next/server";
import { TodoService } from "@/lib/api/service/TodoService";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // Lấy ID từ URL
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    const oldTodo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    const updated = await TodoService.saveTodo(userId, { ...body, id });
    if (updated && oldTodo) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { hoTen: true },
      });

      let detailMsg = `Đã cập nhật công việc: ${updated.title}`;
      // Check nếu người dùng vừa tích hoàn thành
      if (body.status !== undefined && body.status !== oldTodo.status) {
        detailMsg = body.status
          ? `Đã hoàn thành công việc: ${updated.title} ✅`
          : `Đã đánh dấu chưa hoàn thành: ${updated.title} ⏳`;
      }
      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "CẬP NHẬT TODO",
          table: "todo",
          detail: detailMsg,
          type: "TODO",
        },
      });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const todoToDelete = await prisma.todo.findUnique({
      where: { id: todoId },
    });
    if (!todoToDelete) {
      return NextResponse.json(
        { message: "Không tìm thấy Todo" },
        { status: 404 },
      );
    }

    // 1. Tìm thông tin trước khi xóa
    await TodoService.deleteTodo(todoId);

    if (userId > 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { hoTen: true },
      });

      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "XÓA CÔNG VIỆC",
          table: "todo",
          detail: `Đã xóa công việc: ${todoToDelete.title}`,
          type: "DELETE",
        },
      });
    }
    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
