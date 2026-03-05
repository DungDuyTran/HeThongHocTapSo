import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Lấy tất cả thẻ của 1 folder
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = parseInt(searchParams.get("folderId") || "0");
  const cards = await prisma.flashcard.findMany({
    where: { folderId },
  });
  return NextResponse.json(cards);
}

// Thêm thẻ mới
export async function POST(req: Request) {
  const body = await req.json();
  const card = await prisma.flashcard.create({
    data: {
      front: body.front,
      back: body.back,
      folderId: body.folderId,
    },
  });
  return NextResponse.json(card);
}

// Xóa hoặc Sửa thẻ (Dùng DELETE/PATCH tùy bạn, ở đây mình làm DELETE làm mẫu)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");
  await prisma.flashcard.delete({ where: { id } });
  return NextResponse.json({ message: "Đã xóa thẻ" });
}
