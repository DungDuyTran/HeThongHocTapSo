import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/api/controller/NoteController";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { hoTen: true }
    });
    const response = await noteController.updateNote(req);
    const updatedNote = await response.json();
    if (response.ok && userId > 0) {

      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "CẬP NHẬT GHI CHÚ",
          table: "note",
          detail: `Người dùng đã chỉnh sửa ghi chú: ${updatedNote.title}`,
          type: "UPDATE",
        },
      });
    }
    return NextResponse.json(updatedNote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const noteId = parseInt(id);
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const noteToDelete = await prisma.note.findUnique({
      where: { id: noteId },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { hoTen: true }
    });

    const response = await noteController.deleteNote(req, noteId);

    if (response.ok && userId > 0 && noteToDelete) {

      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "XÓA GHI CHÚ",
          table: "note",
          detail: `Người dùng đã xóa ghi chú: ${noteToDelete.title}`,
          type: "DELETE",
        },
      });
    }
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
