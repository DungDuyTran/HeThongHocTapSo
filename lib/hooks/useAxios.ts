"use client";
import { useState, useCallback } from "react";
import { request } from "@/lib/api/axiosPublic";
import axios from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

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
          headers["x-user-id"] = user.id.toString();
          headers["x-user-name"] = user.hoTen;

          // Chuẩn bị Body cho các phương thức ghi dữ liệu
          if (method !== "GET" && body && !(body instanceof FormData)) {
            finalBody = {
              ...(body as object),
              userId: user.id,
              userName: user.hoTen
            };
          }
        }
        const result = await request<T>(method, url, finalBody, { 
        headers: user ?{
          ...headers, 
          "x-user-id": user.id.toString(),
          "x-user-name": encodeURIComponent(user.hoTen) 
        }: headers
      });
        
        setData(result);
        return result;
      } catch (err: unknown) {
        console.error("API Error:", err);
        let message = "Có lỗi xảy ra!";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || err.response?.data?.error || err.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, error, loading, fetchData };
}