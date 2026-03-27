import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        hoTen: true,
        email: true,
        sdt: true,
        vaiTro: true,
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}