import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // 1. Tạo mật khẩu ngẫu nhiên 8 ký tự
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Cập nhật vào DB
    const user = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    if (!user.email) {
      return NextResponse.json(
        { error: "Người dùng này không có địa chỉ email" },
        { status: 400 },
      );
    }

    // 3. Gửi Email
    await transporter.sendMail({
      from: '"Hệ thống Học Tập Số" <noreply@yourdomain.com>',
      to: user.email!,
      subject: "Cấp lại mật khẩu truy cập hệ thống",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Xin chào ${user.hoTen},</h2>
          <p>Quản trị viên đã reset mật khẩu cho tài khoản của bạn.</p>
          <p style="font-size: 18px;">Mật khẩu mới của bạn là: <b>${newPassword}</b></p>
          <p style="color: red;">Vui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Đã reset và gửi mail thành công!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
