"use client";
import { CalendarDays, BarChart3, PieChart } from "lucide-react";

export default function StatisticsFilter({
  period,
  setPeriod,
  view,
  setView,
}: any) {
  const periods = [
    { label: "Tuần này", value: "week" },
    { label: "Tháng này", value: "month" },
    { label: "Năm nay", value: "year" },
  ];

  return (
    <aside className="w-64 flex flex-col gap-6 border-r-2 border-slate-100 pr-6 text-black">
      <div>
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
          <CalendarDays size={16} /> Thời gian
        </h3>
        <div className="flex flex-col gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`p-3 rounded-xl border-2 border-black font-bold text-sm text-left transition-all ${
                period === p.value
                  ? "bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
          <BarChart3 size={16} /> Loại biểu đồ
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setView("quantity")}
            className={`p-3 rounded-xl border-2 border-black font-bold text-sm text-left transition-all ${
              view === "quantity"
                ? "bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white"
            }`}
          >
            Tổng số lượng
          </button>
          <button
            onClick={() => setView("rate")}
            className={`p-3 rounded-xl border-2 border-black font-bold text-sm text-left transition-all ${
              view === "rate"
                ? "bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white"
            }`}
          >
            Tỷ lệ phần trăm
          </button>
        </div>
      </div>
    </aside>
  );
}
