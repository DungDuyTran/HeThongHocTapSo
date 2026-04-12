"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra");

      setMessage(
        "Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...",
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Nếu không có token trên URL thì báo lỗi ngay
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgb(18,71,105)]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold">Liên kết không hợp lệ!</h2>
          <p className="mt-4">Vui lòng kiểm tra lại email của bạn.</p>
          <a href="/auth/login" className="mt-4 block underline">
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <img
        src="/anh2.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full opacity-95">
        <div className="bg-[rgb(18,71,105)] bg-opacity-80 p-10 rounded-lg w-[400px] shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Đặt lại mật khẩu
          </h1>

          {error && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded mb-4 text-red-200 text-center text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded mb-4 text-green-200 text-center text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="p-4 rounded bg-[rgb(150,200,241)] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              className="p-4 rounded bg-[rgb(150,200,241)] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[rgb(24,71,171)] hover:bg-[rgb(42,95,208)] text-white font-semibold py-3 rounded disabled:opacity-50 transition-colors"
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[rgb(18,71,105)] text-white font-bold">
          Đang tải yêu cầu xác thực...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
