import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/service/AuthService";

export async function POST(req: NextRequest) {
  const authService = new AuthService();

  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu" },
        { status: 401 }
      );
    }

    if (user.sdt === "LOCKED") {
      return NextResponse.json(
        { error: "Tài khoản của bạn đã bị khóa bởi Admin!, hãy kiểm tra email của bạn" },
        { status: 403 }
      );
    }

    const loginResult = await authService.login(email, password);
    if (!loginResult) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu" },
        { status: 401 },
      );
    }
    console.log(">>> Login thành công. Vai trò:", loginResult.user.vaiTro);

    const res = NextResponse.json({
      message: "Đăng nhập thành công",
      user: loginResult.user,
    });

    // Thiết lập Cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    res.cookies.set("access_token", loginResult.accessToken, {
      ...cookieOptions,
      maxAge: 3600, // 1 giờ
    });

    res.cookies.set("refresh_token", loginResult.refreshToken, {
      ...cookieOptions,
      maxAge: 604800,
    });

    return res;
  } catch (error: any) {
    console.error("LỖI LOGIN API:", error.message);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
