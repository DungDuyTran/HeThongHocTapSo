"use client";
import React from "react";
import { Calendar, BarChart3 } from "lucide-react";

export default function HistoryFilter({
  timeRange,
  setTimeRange,
  viewMode,
  setViewMode,
}: any) {
  return (
    <aside className="lg:w-1/4 space-y-4">
      {/* Phạm vi thời gian */}
      <div className="p-5 border-2 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] bg-white">
        <p className="text-[10px] font-black uppercase text-green-600 mb-4 flex items-center gap-2">
          <Calendar size={12} /> Phạm vi
        </p>
        <div className="flex flex-col gap-2">
          {["week", "month", "year"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t as any)}
              className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase italic transition-all border-2 border-black ${
                timeRange === t
                  ? "bg-green-600 text-white shadow-none translate-y-0.5"
                  : "bg-white text-black shadow-[3px_3px_0px_0px_#000]"
              }`}
            >
              {t === "week"
                ? "Tuần này"
                : t === "month"
                  ? "Tháng này"
                  : "Năm nay"}
            </button>
          ))}
        </div>
      </div>

      {/* Chế độ xem */}
      <div className="p-5 border-2 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] bg-white">
        <p className="text-[10px] font-black uppercase text-green-600 mb-4 flex items-center gap-2">
          <BarChart3 size={12} /> Chế độ
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setViewMode("score")}
            className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase italic border-2 border-black ${
              viewMode === "score"
                ? "bg-green-600 text-white shadow-none translate-y-0.5"
                : "bg-white shadow-[3px_3px_0px_0px_#000]"
            }`}
          >
            Điểm trung bình
          </button>
          <button
            onClick={() => setViewMode("count")}
            className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase italic border-2 border-black ${
              viewMode === "count"
                ? "bg-green-600 text-white shadow-none translate-y-0.5"
                : "bg-white shadow-[3px_3px_0px_0px_#000]"
            }`}
          >
            Số lượng bài
          </button>
        </div>
      </div>
    </aside>
  );
}
