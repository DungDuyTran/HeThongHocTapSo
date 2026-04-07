"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Calendar,
  FileText,
  Layers,
  Clock,
  Filter,
  Loader2,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Edit3,
  StickyNote,
  BookOpen,
  AlertCircle,
} from "lucide-react";

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);

      const res = await axios.get(`/api/admin/activities?${params.toString()}`);
      setActivities(res.data);
      setCurrentPage(1); // Reset về trang 1 khi lọc
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // 1. Hàm render Icon & Màu sắc dựa trên hành động
  const getActionConfig = (type: string, action: string) => {
    const t = type?.toUpperCase() || "";
    const a = action?.toUpperCase() || "";
    if (t === "DELETE" || a.includes("XÓA")) {
      return {
        icon: <Trash2 className="text-red-500" size={18} />,
        badge: "bg-red-100 text-red-600 border-red-200",
        bg: "hover:border-red-200",
      };
    }
    if (t === "TODO" || a.includes("TODO")) {
      return {
        icon: <CheckCircle2 className="text-blue-500" size={18} />,
        badge: "bg-blue-100 text-blue-600 border-blue-200",
        bg: "hover:border-blue-200",
      };
    }
    if (t === "NOTE" || a.includes("GHI CHÚ")) {
      return {
        icon: <StickyNote className="text-amber-500" size={18} />,
        badge: "bg-amber-100 text-amber-600 border-amber-200",
        bg: "hover:border-amber-200",
      };
    }
    if (t === "FLASHCARD" || a.includes("THẺ")) {
      return {
        icon: <BookOpen className="text-purple-500" size={18} />,
        badge: "bg-purple-100 text-purple-600 border-purple-200",
        bg: "hover:border-purple-200",
      };
    }
    if (t === "UPDATE" || a.includes("CẬP NHẬT")) {
      return {
        icon: <Edit3 className="text-orange-500" size={18} />,
        badge: "bg-orange-100 text-orange-600 border-orange-200",
        bg: "hover:border-orange-200",
      };
    }
    if (t === "SUCCESS") {
      return {
        icon: <CheckCircle2 className="text-emerald-500" size={18} />,
        badge: "bg-emerald-100 text-emerald-600 border-emerald-200",
        bg: "hover:border-emerald-200",
      };
    }

    // Mặc định (DANGER/Hệ thống)
    return {
      icon: <Clock className="text-slate-500" size={18} />,
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      bg: "hover:border-slate-300",
    };
  };

  // 2. Logic Phân trang
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return Array.from(new Set(pages));
  };

  return (
    <div className="space-y-6 min-h-screen pb-20">
      <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tight">
        Theo dõi hoạt động
      </h1>

      {/* THANH LỌC - Giữ nguyên của bro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl outline-none focus:bg-slate-50 transition-all font-medium"
          />
        </div>
        <input
          title="Ngày"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border-2 border-black rounded-xl outline-none font-medium"
        />
        <div className="flex gap-2">
          <input
            title="Ngày"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-black rounded-xl outline-none font-medium"
          />
          <button
            title="Lọc"
            onClick={fetchActivities}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold p-2 px-4 border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH TIMELINE */}
      <div className="bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="font-bold uppercase text-xs tracking-widest">
              Đang truy xuất dữ liệu...
            </p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20 font-bold text-slate-400 italic">
            Không có dữ liệu hoạt động.
          </div>
        ) : (
          <div className="space-y-6">
            {currentItems.map((act) => {
              const config = getActionConfig(act.type, act.action); // Truyền thêm act.type vào đây
              return (
                <div key={act.id} className="group relative flex items-start">
                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />

                  <div className="relative h-10 w-10 flex items-center justify-center bg-white border-2 border-black rounded-full z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                    {config.icon}
                  </div>

                  <div
                    className={`ml-6 flex-1 bg-white p-4 rounded-2xl border-2 border-slate-100 ${config.bg} hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg text-slate-800">
                        {act.userName || "Hệ thống"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg border-2 border-slate-100">
                        {(() => {
                          // 1. Kiểm tra tất cả các trường ngày tháng có thể có
                          const dateValue =
                            act.createdAt || act.time || act.ngayTao;

                          // 2. Nếu không có dữ liệu nào cả thì trả về luôn
                          if (!dateValue) return "Vừa xong";

                          const date = new Date(dateValue);

                          // 3. Kiểm tra xem format ngày có hợp lệ không
                          return !isNaN(date.getTime())
                            ? date.toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "Vừa xong";
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border-2 ${config.badge}`}
                      >
                        {act.action}
                      </span>
                      <p className="text-sm text-slate-600 font-medium italic">
                        “{act.detail}”
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ĐIỀU HƯỚNG PHÂN TRANG MỚI (CHỌN SỐ TRANG) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-10 border-t border-slate-100 mt-10">
                <button
                  title="Trang trước"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 border-2 border-black rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span key={`dots-${index}`} className="px-2 font-black">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-10 h-10 border-2 border-black rounded-xl font-black text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  title="Trang sau"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 border-2 border-black rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
