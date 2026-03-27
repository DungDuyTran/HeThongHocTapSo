import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id);

  try {
    // BƯỚC 1: Tìm user hiện tại trong DB để xem nó ĐANG khóa hay ĐANG mở
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { sdt: true, email: true, hoTen: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // BƯỚC 2: Xác định trạng thái mới (Nếu đang LOCKED thì set null, và ngược lại)
    const isCurrentlyLocked = currentUser.sdt === "LOCKED";
    const newSdtValue = isCurrentlyLocked ? null : "LOCKED";
    const actionText = isCurrentlyLocked ? "MỞ KHÓA" : "KHÓA";

    // BƯỚC 3: Cập nhật DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { sdt: newSdtValue }
    });

    // BƯỚC 4: Gửi Mail thông báo (Chỉ gửi nếu có email)
    if (updatedUser.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Hệ Thống Học Tập" <${process.env.EMAIL_USER}>`,
        to: updatedUser.email,
        subject: `[Thông báo] Tài khoản của bạn đã được ${actionText}`,
        html: `<b>Chào ${updatedUser.hoTen}</b>,<br>Tài khoản của bạn đã được <b>${actionText}</b> bởi quản trị viên.`
      });
    }

    return NextResponse.json({ 
      success: true, 
      newStatus: newSdtValue // Trả về trạng thái mới để Frontend cập nhật
    });

  } catch (error) {
    console.error("Lỗi API Toggle Lock:", error);
    return NextResponse.json({ error: "Lỗi xử lý" }, { status: 500 });
  }
}