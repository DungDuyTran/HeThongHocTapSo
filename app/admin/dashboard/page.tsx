"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, FileText, Activity, Zap, ArrowUpRight } from "lucide-react";

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

  if (loading)
    return (
      <div className="p-8 italic text-slate-500 animate-pulse text-center">
        Đang tính toán số liệu thực tế...
      </div>
    );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold text-gray-800 italic">
          Tổng quan hệ thống
        </h1>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 4 Cards thống kê xịn hơn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng học viên",
            value: data.totalUsers,
            color: "text-blue-600",
            icon: Users,
            bg: "bg-blue-50",
          },
          {
            label: "Tài liệu hệ thống",
            value: data.totalDocs,
            color: "text-green-600",
            icon: FileText,
            bg: "bg-green-50",
          },
          {
            label: "Hoạt động hôm nay",
            value: data.activeToday,
            color: "text-orange-600",
            icon: Activity,
            bg: "bg-orange-50",
          },
          {
            label: "Tỉ lệ phản hồi AI",
            value: data.aiResponseRate + "%",
            color: "text-purple-600",
            icon: Zap,
            bg: "bg-purple-50",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {card.label}
              </p>
              <h3 className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500 font-bold">
                <ArrowUpRight size={14} /> +12%
              </div>
            </div>
            <div className={`p-3 ${card.bg} rounded-xl`}>
              <card.icon className={card.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-6 italic">
            Tăng trưởng người dùng thực tế
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorU)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-6 italic text-center">
            Hoạt động gần đây
          </h2>
          <div className="space-y-6">
            {[
              {
                text: "Sinh viên mới đăng ký",
                time: "Vừa xong",
                color: "bg-blue-500",
              },
              {
                text: "Reset mật khẩu thành công",
                time: "15 phút trước",
                color: "bg-orange-500",
              },
              {
                text: "Cập nhật tài liệu mới",
                time: "1 giờ trước",
                color: "bg-green-500",
              },
              {
                text: "Backup dữ liệu Aiven",
                time: "4 giờ trước",
                color: "bg-purple-500",
              },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 relative">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${act.color} mt-1.5 shrink-0 shadow-sm`}
                ></div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-slate-700">
                    {act.text}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {act.time}
                  </p>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
              Xem tất cả nhật ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
