"use client";

import React from "react";

export interface RegisterFormData {
  hoTen: string;
  email: string;
  sdt: string;
  ngaySinh: string;
  password: string;
}

interface Props {
  formData: RegisterFormData;
  error: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  formData,
  error,
  loading,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-white">
      <img
        src="/anh1.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-90 fixed"
      />

      {/* Chỉnh items-center và min-h-screen để form vào giữa màn hình */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-10">
        <div className="bg-[rgb(237,215,148)] bg-opacity-80 p-8 rounded-lg w-[450px] shadow-xl">
          <h1 className="text-5xl font-bold text-[rgb(163,138,60)] mb-3 text-center drop-shadow-md">
            Đăng ký
          </h1>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded mb-4 text-white text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-[rgb(163,138,60)] text-sm ml-1">
                Họ và tên *
              </label>
              <input
                type="text"
                name="hoTen"
                required
                value={formData.hoTen}
                onChange={onChange}
                placeholder="Nguyễn Văn A"
                className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(124,111,37)]"
              />
            </div>

            <div>
              <label className="text-[rgb(163,138,60)] text-sm ml-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                placeholder="example@gmail.com"
                className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(124,111,37)]"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[rgb(163,138,60)] text-sm ml-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="sdt"
                  value={formData.sdt}
                  onChange={onChange}
                  placeholder="09xxx"
                  className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(124,111,37)]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[rgb(163,138,60)] text-sm ml-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={onChange}
                  className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(124,111,37)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[rgb(163,138,60)] text-sm ml-1">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={onChange}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(124,111,37)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[rgb(183,156,76)] hover:bg-[rgb(155,134,72)] text-white font-semibold py-3 rounded disabled:opacity-50 transition duration-200"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>

          <p className="mt-6 text-black text-center text-sm">
            Đã có tài khoản?{" "}
            <a
              className="text-[rgb(255,255,255)] hover:underline hover:text-gray-200 font-bold ml-3"
              href="/auth/login"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}