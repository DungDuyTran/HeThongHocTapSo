"use client";

import { useState, useCallback } from "react";
import { request } from "@/lib/api/axiosPublic";
import axios from "axios";

// Mở rộng thêm PATCH nếu hệ thống của bạn cần dùng
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * useAxios<T>: Hook dùng chung cho các API Client-side
 * @template T Kiểu dữ liệu mong đợi từ API trả về
 */
export function useAxios<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (method: HttpMethod, url: string, body?: unknown) => {
      setLoading(true);
      setError(null);

      try {
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const user = userStr ? JSON.parse(userStr) : null;

        let finalBody = body;
        let headers: any = {};

        if (user) {
    // 1. Chuẩn bị Header (Cho các API dùng Header như Upload tài liệu)
          headers["x-user-id"] = user.id.toString();
          headers["x-user-name"] = user.hoTen;

    // 2. Chuẩn bị Body (Cho API dùng Body như Xóa tài liệu)
        if (method === "DELETE" || method === "POST" || method === "PUT") {
        if (!(body instanceof FormData)) {
          finalBody = {
            ...(body as object),
            userId: user.id,
            userName: user.hoTen
          };
       }
    }
  }

  // 3. Truyền cả finalBody và headers vào request
  // Lưu ý: Bro phải xem hàm request trong axiosPublic có hỗ trợ nhận tham số thứ 4 là headers không nhé
  const result = await request<T>(method, url, finalBody); 
  
  setData(result);
  return result;
      } catch (err: unknown) {
        console.error("API Error:", err);

        let message = "Có lỗi xảy ra!";

        // Kiểm tra lỗi nếu là lỗi từ Axios
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            message;
        } else if (err instanceof Error) {
          // Lỗi logic Javascript thông thường
          message = err.message;
        }

        setError(message);
        throw err; // Ném lỗi ra để Component xử lý nếu cần
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, fetchData };
}
