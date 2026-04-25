import { NextResponse } from "next/server";
import { FlashcardService } from "@/lib/api/service/FlashcardService";
import prisma from "@/lib/prisma";

const service = new FlashcardService();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = parseInt(searchParams.get("folderId") || "0");
  const cards = await service.getCardsByFolder(folderId);
  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = parseInt(req.headers.get("x-user-id") || "0");
  const card = await service.saveCard(body);
  // Ghi Log: Thêm thẻ mới
  if (card && userId > 0) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { hoTen: true } });
    await prisma.auditLog.create({
      data: {
        userId,
        userName: user?.hoTen || "Học viên",
        action: "THÊM THẺ HỌC",
        table: "flashcard",
        detail: `Đã thêm thẻ mới: ${card.front}`, // Giả sử trường là term (thuật ngữ)
        type: "CREATE",
      }
    });
    }
  return NextResponse.json(card);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const userId = parseInt(req.headers.get("x-user-id") || "0");
  const card = await service.saveCard(body); // saveCard xử lý cả update nếu có id
  if (card && userId > 0) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { hoTen: true } });
    await prisma.auditLog.create({
      data: {
        userId,
        userName: user?.hoTen || "Học viên",
        action: "CẬP NHẬT THẺ",
        table: "flashcard",
        detail: `Đã chỉnh sửa thẻ: ${card.front}`,
        type: "UPDATE",
      }
    });
  }
  return NextResponse.json(card);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");
  const userId = parseInt(req.headers.get("x-user-id") || "0");
  // Lấy thông tin trước khi xóa
  const cardToDelete = await prisma.flashcard.findUnique({ where: { id } });
  await service.removeCard(id);
  if (cardToDelete && userId > 0) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { hoTen: true } });
    await prisma.auditLog.create({
      data: {
        userId,
        userName: user?.hoTen || "Học viên",
        action: "XÓA THẺ HỌC",
        table: "flashcard",
        detail: `Đã xóa thẻ: ${cardToDelete.front}`,
        type: "DELETE",
      }
    });
  }
  return NextResponse.json({ message: "Đã xóa thẻ" });
}
