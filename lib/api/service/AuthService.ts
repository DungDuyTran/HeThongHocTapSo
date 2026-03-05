// @/lib/api/service/AuthService.ts
import { UserRepository } from "../repositories/UserRepository";
import { jwtService } from "./jwt.service";
import bcrypt from "bcryptjs";
import { VaiTro, User } from "@prisma/client";
import { CreateUserDto } from "../schemas/UserSchemas";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string | null; hoTen: string; vaiTro: VaiTro };
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Đăng ký người dùng và tự động tạo HocVien/Admin tương ứng
   */
  async register(data: CreateUserDto): Promise<User | null> {
    // 1. Kiểm tra email tồn tại
    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) return null;
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Chuẩn bị dữ liệu tạo User với Nested Writes
    // Kỹ thuật này đảm bảo tính Atomicity (Tất cả hoặc không có gì)
    const createData = {
      hoTen: data.hoTen,
      email: data.email ?? null,
      sdt: data.sdt ?? null,
      ngaySinh: data.ngaySinh ?? null,
      password: hashedPassword,
      vaiTro: data.vaiTro || VaiTro.HocVien,

      ...(data.vaiTro === VaiTro.HocVien && {
        hocVien: {
          create: {},
        },
      }),

      ...(data.vaiTro === VaiTro.Admin && {
        admin: {
          create: {},
        },
      }),
    };

    // 4. Gọi repository để thực thi
    return this.userRepository.create(createData as any);
  }

  /**
   * Đăng nhập (Giữ nguyên logic của bạn)
   */
  async login(email: string, pass: string): Promise<LoginResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    const accessToken = jwtService.signAccessToken({
      userId: user.id,
      email: user.email ?? "",
      vaiTro: user.vaiTro,
    });

    const refreshToken = jwtService.signRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        hoTen: user.hoTen,
        vaiTro: user.vaiTro,
      },
    };
  }
}
