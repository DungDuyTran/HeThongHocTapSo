"use client";
import React from "react";
import { Cpu } from "lucide-react";

export default function AiInsights({
  stats,
  name,
}: {
  stats: any;
  name: string;
}) {
  return (
    <footer className="p-4 border-[3px] border-black rounded-[32px] bg-white shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-center gap-8 flex-shrink-0">
      <div className="flex items-center gap-4 border-b-2 md:border-b-0 md:border-r-2 border-slate-100 pb-4 md:pb-0 md:pr-8 shrink-0">
        <div className="p-3 bg-green-50 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] text-green-600">
          <Cpu size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black uppercase italic leading-none tracking-tighter">
          AI <br /> Insights
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="p-5 bg-green-50/50 rounded-2xl border-2 border-dashed border-green-600 text-sm font-bold text-green-800 italic flex items-center">
          {stats.todoPending > 0
            ? `${name} ơi, còn ${stats.todoPending} việc chưa xong. Cố gắng dứt điểm nhé!`
            : "Tuyệt vời! Bạn đã hoàn thành mọi mục tiêu."}
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-500 italic flex items-center">
          Mẹo: Dành 15 phút Flashcard mỗi tối giúp ghi nhớ kiến thức tốt hơn
          40%.
        </div>
      </div>
    </footer>
  );
}
