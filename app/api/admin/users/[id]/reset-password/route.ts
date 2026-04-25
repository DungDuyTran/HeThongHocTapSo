import { NextRequest, NextResponse } from "next/server";
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
    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      await tx.notification.create({
        data: {
          userId: id,
          title: "BẢO MẬT: MẬT KHẨU ĐÃ THAY ĐỔI",
          message: `Quản trị viên đã cấp lại mật khẩu mới cho bạn. Vui lòng kiểm tra email và đổi lại mật khẩu ngay nhé!`,
          isRead: false,
        },
      });

      return updatedUser;
    });

    if (!user.email) {
      return NextResponse.json(
        { error: "Người dùng này không có địa chỉ email" },
        { status: 400 },
      );
    }

    // 3. Gửi Email
    await transporter.sendMail({
      from: '"Hệ thống Học Tập Thông Minh" <noreply@hethonghoctap.com>',
      to: user.email,
      subject: "🔑 THÔNG BÁO CẤP LẠI MẬT KHẨU",
      html: `
    <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #10b981; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Trợ lý Học tập Thông minh</h1>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #333; margin-top: 0;">Xin chào, ${user.hoTen}!</h2>
        <p style="color: #555; line-height: 1.6;">Chúng tôi nhận được yêu cầu cấp lại mật khẩu cho tài khoản của bạn trên hệ thống. Dưới đây là mật khẩu tạm thời mới:</p>
        
        <div style="background-color: #f3f4f6; border: 2px dashed #10b981; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 3px;">${newPassword}</span>
        </div>

        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px;">
          <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: bold;">⚠️ Lưu ý quan trọng:</p>
          <p style="color: #991b1b; margin: 5px 0 0; font-size: 13px; line-height: 1.4;">
            Vì lý do bảo mật, mật khẩu này chỉ có giá trị tạm thời. Vui lòng đăng nhập và <b>thay đổi mật khẩu ngay lập tức</b> để bảo vệ tài khoản của bạn.
          </p>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #eee;">
        <p style="margin: 0;">Đây là email tự động từ hệ thống, vui lòng không phản hồi email này.</p>
        <p style="margin: 10px 0 0;">© 2026 Ecosystem - Hệ sinh thái Học tập Thông minh</p>
      </div>
    </div>
  `,
    });

    return NextResponse.json({ message: "Đã reset và gửi mail thành công!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
