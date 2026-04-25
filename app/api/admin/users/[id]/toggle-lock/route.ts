import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { sdt: true, email: true, hoTen: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const isCurrentlyLocked = currentUser.sdt === "LOCKED";
    const newSdtValue = isCurrentlyLocked ? null : "LOCKED";
    const actionText = isCurrentlyLocked ? "MỞ KHÓA" : "KHÓA TẠM THỜI";
    const statusColor = isCurrentlyLocked ? "#10b981" : "#ef4444";

    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('vi-VN');
    const fullTime = `${timeString} ngày ${dateString}`;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { sdt: newSdtValue }
      });

      await tx.notification.create({
        data: {
          userId: userId,
          title: isCurrentlyLocked 
            ? "🔓 TÀI KHOẢN ĐÃ ĐƯỢC MỞ KHÓA" 
            : "🔒 THÔNG BÁO KHÓA TÀI KHOẢN",
          message: isCurrentlyLocked 
            ? `Tài khoản của bạn đã được Quản trị viên mở khóa vào lúc ${fullTime}. Chào mừng bạn quay trở lại hệ thống!` 
            : `Tài khoản của bạn đã bị tạm khóa vào lúc ${fullTime}. Mọi truy cập sẽ bị hạn chế cho đến khi có thông báo mới.`,
          isRead: false,
        },
      });

      return user;
    });

    //Gửi Mail thông báo (Chỉ gửi nếu có email)
    if (updatedUser.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Hệ thống Học Tập Thông Minh" <noreply@hethonghoctap.com>',
        to: updatedUser.email,
        subject: `[Thông báo] Tài khoản của bạn đã được ${actionText}`,
        html: `
          <div style="max-width: 600px; margin: auto; font-family: sans-serif; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: ${statusColor}; padding: 25px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px; text-transform: uppercase;">Thông Báo Hệ Thống</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333;">Xin chào, ${updatedUser.hoTen}!</h2>
              <p style="color: #555; line-height: 1.6;">Chúng tôi thông báo về việc thay đổi trạng thái tài khoản của bạn trên hệ thống:</p>
              
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #eee;">
                <p style="margin: 0; color: #666;">Trạng thái mới:</p>
                <span style="font-size: 22px; font-weight: bold; color: ${statusColor};">${actionText}</span>
              </div>

              <p style="color: #666; font-size: 14px; font-style: italic;">
                ${isCurrentlyLocked 
                  ? "Bây giờ bạn đã có thể đăng nhập và sử dụng đầy đủ các tính năng của hệ thống." 
                  : "Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ với Quản trị viên qua email hỗ trợ."}
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Ecosystem - Hệ sinh thái Học tập Thông minh</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      newStatus: newSdtValue, // Trả về trạng thái mới để Frontend cập nhật
    });
  } catch (error) {
    console.error("Lỗi API Toggle Lock:", error);
    return NextResponse.json({ error: "Lỗi xử lý" }, { status: 500 });
  }
}
