import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const userId = parseInt(req.headers.get("x-user-id") || "0");
  const folders = await prisma.flashcardFolder.findMany({
    where: { userId },
    include: { _count: { select: { cards: true } } }, // Đếm xem có bao nhiêu thẻ
  });
  return NextResponse.json(folders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = parseInt(req.headers.get("x-user-id") || "0");
  const folder = await prisma.flashcardFolder.create({
    data: { name: body.name, userId },
  });
  return NextResponse.json(folder);
}
