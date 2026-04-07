"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/lib/hooks/useAxios";
import { User_vaiTro } from "@prisma/client";

interface LoginResponse {
  message: string;
  user: {
    id: number;
    hoTen: string;
    email: string;
    vaiTro: User_vaiTro;
  };
}

export function useLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { fetchData, loading } = useAxios<LoginResponse>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      const res = await fetchData("POST", "/api/auth/login", formData);
      
      if (res && res.user) {
        // ✅ 1. Lưu đúng object user (có id và hoTen) vào máy
        localStorage.setItem("user", JSON.stringify(res.user)); 

        alert(res.message || "Đăng nhập thành công");

        // ✅ 2. Điều hướng dựa trên vai trò
        const role = res.user.vaiTro;
        if (role === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/users/documents"); // Hoặc /users tùy bro
        }
      }
    } catch (err: any) {
      const serverMessage = err.response?.data?.error || "Email hoặc mật khẩu không chính xác";
      setError(serverMessage);
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
}
