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
   * Đăng ký người dùng
   */
  async register(data: CreateUserDto): Promise<User | null> {
    // 1. Chỉ kiểm tra email nếu người dùng thực sự nhập email
    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) return null;
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Tạo User mới
    // Sử dụng toán tử ?? null để đảm bảo Prisma nhận giá trị null thay vì undefined
    return this.userRepository.create({
      hoTen: data.hoTen,
      email: data.email ?? null,
      sdt: data.sdt ?? null,
      ngaySinh: data.ngaySinh ?? null,
      password: hashedPassword,
      vaiTro: data.vaiTro || VaiTro.HocVien,
    } as any); // Ép kiểu any ở đây để bypass kiểm tra nghiêm ngặt của BaseRepository
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
