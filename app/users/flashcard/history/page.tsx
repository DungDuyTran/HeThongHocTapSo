"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, ListChecks } from "lucide-react";
import { useFlashcardHistory } from "../hooks/useFlashcardHistory";
import HistoryFilter from "./components/HistoryFilter";
import HistoryCharts from "./components/HistoryCharts";
import HistoryReviewModal from "./components/HistoryReviewModal";
import { notifier } from "@/lib/notifier";

export default function FlashcardHistoryPage() {
  const router = useRouter();
  const {
    history,
    chartData,
    isLoading,
    timeRange,
    setTimeRange,
    viewMode,
    setViewMode,
    selectedHistory,
    setSelectedHistory,
  } = useFlashcardHistory();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black italic text-green-600 animate-pulse uppercase text-xs">
        ĐANG TẢI DỮ LIỆU...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen text-black no-scrollbar animate-in fade-in duration-500">
      <header className="flex items-center gap-4 mb-10 border-b-4 border-black pb-6">
        <button
          onClick={() => router.back()}
          className="p-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={18} strokeWidth={3} />
        </button>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Lịch sử rèn luyện
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <HistoryFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <HistoryCharts viewMode={viewMode} chartData={chartData} />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2 border-l-8 border-green-600 pl-4">
          <ListChecks size={24} /> Danh sách bài thi (Click để xem chi tiết)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history?.map((item: any) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.details) setSelectedHistory(item);
                else notifier.warn("Bài thi này không có dữ liệu chi tiết.");
              }}
            >
              <HistoryCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <HistoryReviewModal
        data={selectedHistory}
        onClose={() => setSelectedHistory(null)}
      />
    </div>
  );
}

function HistoryCard({ item }: any) {
  return (
    <div className="cursor-pointer p-6 border-[3px] border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] bg-white hover:bg-green-50 active:translate-y-1 active:shadow-none transition-all">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-black uppercase italic text-black truncate max-w-[150px]">
          {item.folder.name}
        </h4>
        <span className="text-[10px] font-bold text-slate-400">
          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t-2 border-black/10">
        <div className="flex gap-4 text-[10px] font-black text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen size={12} /> {item.correctAnswers}/{item.totalQuestions}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {Math.floor(item.timeSpent / 60)}:
            {(item.timeSpent % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          {item.score.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
