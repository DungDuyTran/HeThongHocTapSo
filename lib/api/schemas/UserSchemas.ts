// @/lib/api/schemas/UserSchemas.ts
import { z } from "zod";

export const VaiTroEnum = z.enum(["HocVien", "Admin"]);

export const CreateUserSchema = z.object({
  hoTen: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  // email, sdt, ngaySinh được phép null hoặc undefined để khớp với Database
  email: z.string().email("Email không hợp lệ").nullable().optional(),
  sdt: z.string().min(9, "Số điện thoại không hợp lệ").nullable().optional(),
  // Sử dụng coerce để tự động chuyển string "YYYY-MM-DD" từ input sang Date object
  ngaySinh: z.coerce.date().nullable().optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  // vaiTro mặc định hoặc nhận từ enum
  vaiTro: VaiTroEnum.optional().default("HocVien"),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Inferred type từ Zod sẽ là nguồn chuẩn cho mọi nơi khác
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
