"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/lib/hooks/useAxios";
import { User_vaiTro } from "@prisma/client";
import { notifier } from "@/lib/notifier";

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

      if (!res) return;

      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        
        if (typeof notifier !== 'undefined') {
          notifier.success(res.message || "Đăng nhập thành công");
        }

        const role = res.user.vaiTro;
        if (role === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/users");
        }
      }
    } catch (err: any) {
      console.log("Lỗi đăng nhập:", err);

      const status = err.response?.status;
      const serverError = err.response?.data?.error;

      if (status === 403) {
        setError(serverError || "Tài khoản đã bị khóa bởi Quản trị viên.");
      } else if (status === 401) {
        setError("Email hoặc mật khẩu không chính xác.");
      } else {
        setError(serverError || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
      }
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
}
