import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FlashcardService } from "@/lib/api/service/FlashcardService";

const service = new FlashcardService();
export async function GET(req: Request) {
  try {
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const folders = await prisma.flashcardFolder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { flashcards: true }, // Đếm thẻ dựa trên tên quan hệ mới
        },
      },
    });
    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const { name } = body; // Tên bộ thẻ

    const newFolder = await prisma.flashcardFolder.create({
      data: {
        name: name,
        userId: userId,
      }
    });

    if (newFolder && userId > 0) {
      const user = await prisma.user.findUnique({ 
        where: { id: userId }, 
        select: { hoTen: true } 
      });

      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "TẠO BỘ THẺ",
          table: "flashcardfolder",
          detail: `Đã tạo bộ thẻ mới: ${name}`,
          type: "CREATE",
        }
      });
      console.log("Đã ghi log tạo bộ thẻ thành công!");
    }

    return NextResponse.json(newFolder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");
    const userId = parseInt(req.headers.get("x-user-id") || "0");
    const folderToDelete = await prisma.flashcardFolder.findUnique({
      where: { id: id }
    });

    if (!folderToDelete) {
      return NextResponse.json({ error: "Không tìm thấy thư mục" }, { status: 404 });
    }
    await service.removeFolder(id);
    if (userId > 0) {
      const user = await prisma.user.findUnique({ 
        where: { id: userId }, 
        select: { hoTen: true } 
      });

      await prisma.auditLog.create({
        data: {
          userId,
          userName: user?.hoTen || "Học viên",
          action: "XÓA BỘ THẺ",
          table: "flashcardfolder",
          detail: `Đã xóa bộ thẻ: ${folderToDelete.name}`,
          type: "DELETE", 
        }
      });
      console.log("Đã ghi log xóa bộ thẻ thành công!");
    }
    return NextResponse.json({ message: "Xóa thư mục thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa thư mục" }, { status: 500 });
  }
}
