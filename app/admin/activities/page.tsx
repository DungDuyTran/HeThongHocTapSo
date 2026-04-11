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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Edit3,
  StickyNote,
  BookOpen,
  X,
} from "lucide-react";

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState(""); // State mới để lọc danh mục
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);
      if (filterType) params.append("type", filterType); // Gửi type lên API

      const res = await axios.get(`/api/admin/activities?${params.toString()}`);
      setActivities(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionConfig = (type: string, action: string) => {
    const t = type?.toUpperCase() || "";
    const a = action?.toUpperCase() || "";
    if (t === "DELETE" || a.includes("XÓA")) {
      return { icon: <Trash2 className="text-red-500" size={18} />, badge: "bg-red-100 text-red-600 border-red-200", bg: "hover:border-red-200" };
    }
    if (t === "TODO" || a.includes("TODO")) {
      return { icon: <CheckCircle2 className="text-blue-500" size={18} />, badge: "bg-blue-100 text-blue-600 border-blue-200", bg: "hover:border-blue-200" };
    }
    if (t === "NOTE" || a.includes("GHI CHÚ")) {
      return { icon: <StickyNote className="text-amber-500" size={18} />, badge: "bg-amber-100 text-amber-600 border-amber-200", bg: "hover:border-amber-200" };
    }
    if (t === "FLASHCARD" || a.includes("THẺ")) {
      return { icon: <BookOpen className="text-purple-500" size={18} />, badge: "bg-purple-100 text-purple-600 border-purple-200", bg: "hover:border-purple-200" };
    }
    if (t === "UPDATE" || a.includes("CẬP NHẬT")) {
      return { icon: <Edit3 className="text-orange-500" size={18} />, badge: "bg-orange-100 text-orange-600 border-orange-200", bg: "hover:border-orange-200" };
    }
    return { icon: <Clock className="text-slate-500" size={18} />, badge: "bg-slate-100 text-slate-600 border-slate-200", bg: "hover:border-slate-300" };
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const currentItems = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
      else if (i === currentPage - 2 || i === currentPage + 2) pages.push("...");
    }
    return Array.from(new Set(pages));
  };

  return (
    <div className="space-y-6 min-h-screen pb-20">
      <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tight">Theo dõi hoạt động</h1>

      {/* THANH LỌC ĐÃ CẢI TIẾN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-5 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Tìm kiếm (Thu gọn lại col-span-4) */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl outline-none focus:bg-slate-50 font-medium text-sm"
          />
        </div>

        {/* Lọc danh mục (Mới thêm) */}
        <div className="md:col-span-2">
          <select title="Chọn"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black rounded-xl outline-none font-bold text-sm bg-white cursor-pointer"
          >
            <option value="">Tất cả mục</option>
            <option value="TODO">Todo</option>
            <option value="FLASHCARD">Flashcard</option>
            <option value="NOTE">Ghi chú</option>
            <option value="DOCUMENT">Tài liệu</option>
          </select>
        </div>

        {/* Ngày bắt đầu */}
        <div className="md:col-span-2">
          <input title="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black rounded-xl outline-none font-medium text-sm"
          />
        </div>

        {/* Ngày kết thúc + Nút lọc */}
        <div className="md:col-span-4 flex gap-2">
          <input title="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-black rounded-xl outline-none font-medium text-sm"
          />
          <button
            onClick={fetchActivities}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-black p-2 px-5 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 text-sm"
          >
            <Filter size={18} /> LỌC
          </button>
        </div>
      </div>

      {/* DANH SÁCH TIMELINE */}
      <div className="bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="font-bold uppercase text-xs tracking-widest">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20 font-bold text-slate-400 italic">Không có dữ liệu hoạt động.</div>
        ) : (
          <div className="space-y-6">
            {currentItems.map((act) => {
              const config = getActionConfig(act.type, act.action);
              return (
                <div key={act.id} className="group relative flex items-start">
                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />
                  <div className="relative h-10 w-10 flex items-center justify-center bg-white border-2 border-black rounded-full z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                    {config.icon}
                  </div>
                  <div onClick={() => setSelectedActivity(act)}
                    className={`ml-6 flex-1 bg-white p-4 rounded-2xl border-2 border-slate-100 cursor-pointer ${config.bg} hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg text-slate-800">{act.userName || "Hệ thống"}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg border-2 border-slate-100">
                        {new Date(act.createdAt || act.time).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border-2 ${config.badge}`}>{act.action}</span>
                      <p className="text-sm text-slate-600 font-medium italic">“{act.detail}”</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-10 border-t border-slate-100 mt-10">
                <button title="Trang trước" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 disabled:opacity-30"><ChevronLeft size={18} /></button>
                {getPageNumbers().map((page, i) => (
                  <button key={i} onClick={() => typeof page === 'number' && setCurrentPage(page)} className={`w-10 h-10 border-2 border-black rounded-xl font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${currentPage === page ? "bg-black text-white" : "bg-white"}`}>{page}</button>
                ))}
                <button title="Trang sau" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 disabled:opacity-30"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[32px] overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b-4 border-black bg-yellow-400 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Chi tiết hoạt động</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Người thực hiện</p>
                <p className="font-bold text-xl text-slate-800">{selectedActivity.userName || "Hệ thống"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Hành động</p>
                  <span className={`px-2 py-1 border-2 border-black rounded-md text-[10px] font-black uppercase ${getActionConfig(selectedActivity.type, selectedActivity.action).badge}`}>{selectedActivity.action}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Thời gian</p>
                  <p className="text-xs font-bold text-slate-600">{new Date(selectedActivity.createdAt || selectedActivity.time).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 text-sm italic">“{selectedActivity.detail}”</div>
              <div className="flex gap-2">
                 <div className="flex-1 p-3 border-2 border-black rounded-xl bg-blue-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black">TABLE: {selectedActivity.table}</div>
                 <div className="flex-1 p-3 border-2 border-black rounded-xl bg-purple-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black">TYPE: {selectedActivity.type}</div>
              </div>
            </div>
            <div className="p-6 pt-0"><button onClick={() => setSelectedActivity(null)} className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] active:translate-y-1">Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}