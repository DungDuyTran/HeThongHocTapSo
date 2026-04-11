import { NextRequest, NextResponse } from "next/server";
import { Note } from "@prisma/client";
import { BaseController } from "../base/BaseController";
import { NoteService } from "../service/NoteService";
import prisma from "@/lib/prisma";

export class NoteController extends BaseController<Note> {
  private noteService: NoteService;

  constructor() {
    const service = new NoteService();
    super(service);
    this.noteService = service;
  }
  private getUserName = async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { hoTen: true } });
    return user?.hoTen || "Người dùng";
  };

  getByUser = async (req: NextRequest): Promise<NextResponse> => {
    try {
      const userId = parseInt(req.headers.get("x-user-id") || "0");
      if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const notes = await this.noteService.getByUserId(userId);
      return NextResponse.json(notes);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  };

  createNote = async (req: NextRequest): Promise<NextResponse> => {
    try {
      const userId = parseInt(req.headers.get("x-user-id") || "0");
      if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const data = await req.json();
      const result = await this.noteService.create({ ...data, userId });
      if (result) {
        const name = await this.getUserName(userId);
        await prisma.auditLog.create({
          data: {
            userId: userId,
            userName: name,
            action: "THÊM GHI CHÚ",
            table: "note",
            detail: `Đã tạo ghi chú: ${result.title}`,
            type: "NOTE",
          }
        });
      }
      return NextResponse.json(result);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  };
  updateNote = async (req: NextRequest): Promise<NextResponse> => {
    try {
      const userId = parseInt(req.headers.get("x-user-id") || "0");
      const data = await req.json();
      const urlId = req.nextUrl.pathname.split('/').pop();
      const id = data.id || urlId;

      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
      }
      const noteId = parseInt(id);

      // 1. Thực hiện Update
      const oldNote = await prisma.note.findUnique({ where: { id: parseInt(id) } });
      if (!oldNote) return NextResponse.json({ error: "Không tìm thấy ghi chú" }, { status: 404 });
      const result = await this.noteService.update(noteId, data);

      // 2. Ghi Log Cập nhật
      if (result) {
        const name = await this.getUserName(userId);
        let actionLabel = "CẬP NHẬT GHI CHÚ";
        let detailMsg = `Đã cập nhật nội dung ghi chú: ${result.title}`;
        
        // Kiểm tra logic ghim
        if (oldNote.isPinned === false && result.isPinned === true) {
          actionLabel = "GHIM GHI CHÚ ";
        } else if (oldNote.isPinned === true && result.isPinned === false) {
          actionLabel = "BỎ GHIM GHI CHÚ ";
        } else {
          let changes = [];
          if (data.title && data.title !== oldNote.title) changes.push(`tên (${oldNote.title} ➔ ${data.title})`);
          if (data.category && data.category !== oldNote.category) changes.push(`thể loại (${oldNote.category} ➔ ${data.category})`);
          if (changes.length > 0) detailMsg = `Đã chỉnh sửa ${changes.join(", ")}`;
        }
      
        await prisma.auditLog.create({
          data: {
            userId: userId,
            userName: name,
            action: actionLabel,
            table: "note",
            detail: detailMsg,
            type: "UPDATE",
          }
        });
      }
      return NextResponse.json(result);
    } catch (error: any) {
      console.error("LỖI CONTROLLER:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  };
  deleteNote = async (req: NextRequest, idFromParams?: number): Promise<NextResponse> => {
  try {
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const id = idFromParams || parseInt(req.nextUrl.searchParams.get("id") || "0");

    // 1. Tìm thông tin note trước khi xóa để lấy cái Title
    const noteToDelete = await prisma.note.findUnique({
      where: { id: id }
    });
    if (!noteToDelete) return NextResponse.json({ error: "Không tìm thấy ghi chú" }, { status: 404 });

    // 2. Thực hiện xóa
    const result = await this.noteService.delete(id);

    // 3. Ghi Log Xóa
    if (noteToDelete) {
      const name = await this.getUserName(userId);
      await prisma.auditLog.create({
        data: {
          userId: userId,
          userName: name,
          action: "XÓA GHI CHÚ",
          table: "note",
          detail: `Đã xóa ghi chú: ${noteToDelete.title}`,
          type: "DELETE",
        }
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
}

export const noteController = new NoteController();
