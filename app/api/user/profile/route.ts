import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    const userId = userIdHeader ? parseInt(userIdHeader) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        hoTen: true,
        vaiTro: true,
        email: true,
        sdt: true,
        ngaySinh: true,
        ngayCapNhat: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Lỗi lấy Profile:", error.message);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    const userId = userIdHeader ? parseInt(userIdHeader) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hoTen: data.hoTen,
        email: data.email,
        sdt: data.sdt,
        ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: updatedUser.id,
        userName: updatedUser.hoTen,
        action: "CẬP NHẬT HỒ SƠ",
        table: "user",
        detail: `Người dùng đã cập nhật thông tin cá nhân (${updatedUser.email})`,
        type: "INFO" 
      }
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
