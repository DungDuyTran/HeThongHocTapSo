import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // --- PHẦN THÊM VÀO ĐỂ TẮT LỖI ĐỎ ---
  {
    rules: {
      // Tắt cảnh báo khi sử dụng 'any'
      "@typescript-eslint/no-explicit-any": "off",

      // Tắt cảnh báo khi ép kiểu 'any' (as any)
      "@typescript-eslint/no-unsafe-assignment": "off",

      // Chuyển lỗi "biến đã khai báo nhưng không sử dụng" thành cảnh báo (màu vàng) thay vì đỏ
      "@typescript-eslint/no-unused-vars": "warn",

      // Tắt cảnh báo khi dùng require (nếu bạn có dùng trong file config)
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // ------------------------------------

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
