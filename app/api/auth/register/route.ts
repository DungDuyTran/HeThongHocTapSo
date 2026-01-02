// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/service/AuthService";
import { CreateUserSchema } from "@/lib/api/schemas/UserSchemas";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate dữ liệu đầu vào bằng Zod
    const validation = CreateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    // 2. Gọi Service xử lý đăng ký (Lỗi TS2345 đã được giải quyết)
    const newUser = await authService.register(validation.data);

    if (!newUser) {
      return NextResponse.json(
        { error: "Email đã tồn tại trên hệ thống" },
        { status: 400 }
      );
    }

    // 3. Trả về kết quả an toàn
    const { password, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { message: "Đăng ký tài khoản thành công", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Route Error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
