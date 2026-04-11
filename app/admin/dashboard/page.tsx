"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, Activity, Zap, ArrowUpRight, ChevronRight, Trophy } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/statistics");
        setData(res.data);
      } catch (err) {
        console.error("Lỗi fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
           <div className="w-12 h-12 border-4 border-black border-t-yellow-400 rounded-full animate-spin"></div>
           <p className="font-black italic uppercase text-sm tracking-widest">Đang đồng bộ dữ liệu...</p>
        </div>
      </div>
    );

  const statsCards = [
    { label: "Học viên", value: data?.totalUsers, color: "text-blue-600", icon: Users, bg: "bg-blue-50" },
    { label: "Tài liệu", value: data?.totalDocs, color: "text-emerald-600", icon: FileText, bg: "bg-emerald-50" },
    { label: "Hoạt động hôm nay", value: data?.activeToday, color: "text-orange-600", icon: Activity, bg: "bg-orange-50" },
    { label: "Tỉ lệ AI", value: data?.aiResponseRate + "%", color: "text-purple-600", icon: Zap, bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">
            Tổng quan hệ thống
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase mt-1">Dữ liệu thời gian thực từ Database</p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-500 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 4 Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center group hover:-translate-y-1 transition-all"
          >
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">
                {card.label}
              </p>
              <h3 className={`text-4xl font-black ${card.color}`}>
                {card.value}
              </h3>
            </div>
            <div className={`p-4 ${card.bg} border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white transition-colors`}>
              <card.icon className={card.color} size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ tăng trưởng  */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-black text-slate-800 italic uppercase">Tăng trưởng học viên</h2>
             <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-500 border border-black rounded-full"></div>
                <span className="text-[10px] font-bold uppercase">Người dùng mới</span>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData}>
                <defs>
                  <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 'bold' }} 
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "2px solid black",
                    boxShadow: "4px 4px 0px rgba(0,0,0,1)",
                    fontWeight: "bold"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#000"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorU)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hoạt động gần đây  */}
        <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <h2 className="text-xl font-black text-slate-800 italic uppercase mb-8 text-center underline decoration-yellow-400 decoration-4 underline-offset-4">
            Hoạt động gần đây
          </h2>
          <div className="space-y-8 flex-1">
            {data?.latestActivities?.length > 0 ? (
              data.latestActivities.slice(0, 4).map((act: any, i: number) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== 3 && (
                    <div className="absolute left-[11px] top-6 bottom-[-32px] w-0.5 bg-slate-100 group-hover:bg-black transition-colors"></div>
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 border-black shrink-0 z-10 ${
                    act.type === 'DELETE' ? 'bg-red-400' : 'bg-yellow-400'
                  } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}></div>
                  <div className="flex flex-col -mt-1">
                    <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">
                      {act.action}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      {act.userName || "Hệ thống"}: "{act.detail.substring(0, 30)}..."
                    </p>
                    <p className="text-[10px] text-blue-600 font-black uppercase mt-1">
                      {formatTimeAgo(act.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 font-bold italic py-10">Chưa có nhật ký nào...</p>
            )}
          </div>
          <Link href="/admin/activities" className="mt-8">
            <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-black bg-yellow-400 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
              Xem tất cả nhật ký <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>
      {/* Học viên tích cực  */}
      <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={32} strokeWidth={3} />
            <h2 className="text-2xl font-black text-slate-800 italic uppercase underline decoration-emerald-400 decoration-4 underline-offset-4">
              Học viên tích cực
            </h2>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 border-dashed">
            Xếp hạng theo tổng số tương tác thực tế
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {data?.leaderboardData?.map((student: any, index: number) => (
            <div 
              key={student.id} 
              className="relative p-6 bg-slate-50 border-2 border-black rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all bg-white group text-center"
            >
              <div className={`absolute -top-4 -left-4 w-10 h-10 flex items-center justify-center border-2 border-black rounded-full font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                index === 0 ? 'bg-yellow-400' :
                index === 1 ? 'bg-slate-300' :
                index === 2 ? 'bg-orange-300' : 'bg-white'
              }`}>
                {index + 1}
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 border-2 border-black rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                <Users size={24} />
              </div>
              <h3 className="font-black text-slate-800 uppercase text-sm truncate px-2">{student.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Học viên hệ thống</p>
              
              <div className="inline-flex items-center gap-2 border-2 border-black px-3 py-2 rounded-xl bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                <Activity size={12} className="text-emerald-400" />
                <span className="text-xs font-black">{student.activities} LOGS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}