"use client";
import React from "react";
import { Calendar, CheckSquare, BarChart3, FolderRoot } from "lucide-react";

export default function StatGrid({ stats }: { stats: any }) {
  return (
    <div className="lg:w-[38%] flex flex-col justify-between gap-3">
      <StatCard
        icon={<Calendar size={20} />}
        title="Thời gian biểu"
        desc={`Hôm nay: ${stats.todayEvents || 0} lịch`}
      />
      <StatCard
        icon={<CheckSquare size={20} />}
        title="Nhiệm vụ"
        desc={`${stats.todoDone || 0} xong / ${stats.todoPending || 0} chờ`}
      />
      <StatCard
        icon={<BarChart3 size={20} />}
        title="Hiệu suất"
        desc={`Hoàn thành ${stats.progress || 0}% mục tiêu`}
      />
      <StatCard
        icon={<FolderRoot size={20} />}
        title="Flashcard"
        desc={`${stats.flashcardFolders || 0} thư mục thẻ`}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex-1 p-4 border-[3px] border-black rounded-[24px] bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
      <div className="p-2.5 bg-green-50 border-2 border-black rounded-xl text-green-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-green-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-[13px] font-black uppercase italic leading-none mb-1.5 tracking-tighter">
          {title}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {desc}
        </p>
      </div>
    </div>
  );
}
