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
        // Lấy thông tin user hiện tại từ localStorage
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const user = userStr ? JSON.parse(userStr) : null;

        let finalBody = body;

        // Nếu là lệnh DELETE, mình tự động nhét userId và userName vào body nếu chưa có
        if (method === "DELETE" && user) {
          finalBody = { 
            ...body, 
            userId: user.id, 
            userName: user.hoTen // Đây là chìa khóa để hiện tên thật
          };
          console.log("Dữ liệu gửi đi nè bro:", finalBody);
        }
        
        // Nếu là POST/PUT, mình cũng có thể đính kèm thêm userName vào body
        if ((method === "POST" || method === "PUT") && user && body instanceof Object && !(body instanceof FormData)) {
          finalBody = {
            ...body,
            userName: user.hoTen
          };
        }
        // request<T> từ axiosPublic đã được fix kiểu ở bước trước
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
