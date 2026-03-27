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
    const folder = await prisma.flashcardFolder.create({
      data: { name: body.name, userId },
    });
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo thư mục" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const { id, name } = await req.json();
    const updated = await service.renameFolder(Number(id), name);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi sửa tên" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");
    await service.removeFolder(id);
    return NextResponse.json({ message: "Xóa thư mục thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa thư mục" }, { status: 500 });
  }
}
