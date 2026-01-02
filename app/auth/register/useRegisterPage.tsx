// @/lib/hooks/useRegister.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/lib/hooks/useAxios";

export function useRegister() {
  const router = useRouter();
  const { fetchData, loading } = useAxios<any>();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Spread operator để giữ lại các giá trị cũ
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formData.hoTen || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    try {
      // Ép kiểu null cho các trường trống trước khi gửi lên API
      const payload = {
        ...formData,
        email: formData.email || null,
        sdt: formData.sdt || null,
        ngaySinh: formData.ngaySinh || null,
      };

      await fetchData("POST", "/api/auth/register", payload);
      alert("Đăng ký thành công!");
      router.push("/auth/login");
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(typeof msg === "string" ? msg : "Đăng ký thất bại");
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
}
