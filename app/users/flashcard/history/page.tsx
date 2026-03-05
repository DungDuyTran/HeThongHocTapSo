"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useFlashcardHistory } from "../hooks/useFlashcardHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Award, Clock, BookOpen } from "lucide-react";

export default function FlashcardHistoryPage() {
  const router = useRouter();
  const { history, chartData, isLoading } = useFlashcardHistory();

  return (
    <div className="p-8 bg-white min-h-screen text-black scale-[0.85] origin-top-left w-[117.6%] h-[117.6%] overflow-y-auto">
      {/* 1. Header */}
      <header className="flex justify-between items-end border-b-[4px] border-black pb-6 mb-10">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 font-bold p-2 border-2 border-black rounded-xl hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">
            Lịch sử rèn luyện
          </h1>
        </div>
        <div className="bg-yellow-400 border-[3px] border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-xl italic uppercase">
          Tích cực học tập!
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 2. Biểu đồ tiến độ (Bên trái) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 border-[4px] border-black rounded-[40px] bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] h-[450px]">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">
              Biểu đồ điểm số (%)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "3px solid black",
                      fontWeight: "bold",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={5}
                    dot={{
                      r: 8,
                      fill: "#fff",
                      stroke: "#2563eb",
                      strokeWidth: 3,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Danh sách chi tiết (Bên phải) */}
        <div className="space-y-6 overflow-hidden">
          <h3 className="text-2xl font-black uppercase italic">
            Bài thi gần đây
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <p className="font-bold text-slate-300">Đang tải lịch sử...</p>
            ) : (
              history?.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 border-[3px] border-black rounded-[25px] bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-black text-blue-600 truncate uppercase tracking-tighter italic">
                      {item.folder.name}
                    </h4>
                    <span className="bg-black text-white px-3 py-1 rounded-lg font-black text-sm">
                      {item.score.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} /> {item.correctAnswers}/
                      {item.totalQuestions} câu
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {item.timeSpent}s
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-300 border-t border-slate-100 pt-2">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
