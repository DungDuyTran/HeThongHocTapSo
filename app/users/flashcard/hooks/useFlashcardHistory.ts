"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFlashcardHistory() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [viewMode, setViewMode] = useState<"score" | "count">("score");
  const [selectedHistory, setSelectedHistory] = useState<any>(null);

  const { data: history, isLoading } = useSWR(
    "/api/flashcard/history",
    fetcher,
  );

  const chartData = useMemo(() => {
    if (!history) return [];
    const now = new Date();
    const dataMap: { [key: string]: { scoreTotal: number; count: number } } =
      {};

    // Khởi tạo mốc thời gian
    if (timeRange === "week") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dataMap[`${d.getDate()}/${d.getMonth() + 1}`] = {
          scoreTotal: 0,
          count: 0,
        };
      }
    } else if (timeRange === "month") {
      for (let i = 1; i <= new Date().getDate(); i++) {
        dataMap[`${i}/${now.getMonth() + 1}`] = { scoreTotal: 0, count: 0 };
      }
    } else {
      for (let i = 0; i <= now.getMonth(); i++)
        dataMap[`Tháng ${i + 1}`] = { scoreTotal: 0, count: 0 };
    }

    // Đổ dữ liệu
    history.forEach((item: any) => {
      const itemDate = new Date(item.createdAt);
      const label =
        timeRange === "year"
          ? `Tháng ${itemDate.getMonth() + 1}`
          : `${itemDate.getDate()}/${itemDate.getMonth() + 1}`;

      if (dataMap[label]) {
        dataMap[label].scoreTotal += item.score;
        dataMap[label].count += 1;
      }
    });

    return Object.keys(dataMap).map((key) => ({
      date: key,
      score:
        dataMap[key].count > 0
          ? Math.round(dataMap[key].scoreTotal / dataMap[key].count)
          : 0,
      count: dataMap[key].count,
    }));
  }, [history, timeRange]);

  return {
    history,
    chartData,
    isLoading,
    timeRange,
    setTimeRange,
    viewMode,
    setViewMode,
    selectedHistory,
    setSelectedHistory,
  };
}
