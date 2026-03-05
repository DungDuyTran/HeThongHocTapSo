"use client";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useFlashcardHistory() {
  const { data, isLoading, mutate } = useSWR("/api/flashcard/history", fetcher);

  // Xử lý dữ liệu cho biểu đồ (lấy 10 bài gần nhất, đảo ngược để vẽ từ trái qua phải)
  const chartData = data
    ? [...data]
        .reverse()
        .slice(-10)
        .map((h: any) => ({
          date: new Date(h.createdAt).toLocaleDateString("vi-VN"),
          score: h.score,
        }))
    : [];

  return { history: data, chartData, isLoading, mutate };
}
