"use client";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Bell, CheckCircle, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Info, Check } from "lucide-react";

const fetcher = (url: string) => 
  axios.get(url, { headers: { "x-user-id": "1" } }).then(res => res.data);

export default function NotificationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/notifications?page=${currentPage}`, 
    fetcher,
    { refreshInterval: 5000 } 
  );

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.patch(`/api/notifications/${id}`); 
      mutate(); 
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đã đọc");
    }
  };

  const getTagProps = (type: string) => {
    switch (type?.toUpperCase()) {
      case "SUCCESS":
        return { color: "bg-green-500", icon: <Check size={24} strokeWidth={3} /> };
      case "WARN":
      case "WARNING":
        return { color: "bg-yellow-500", icon: <AlertTriangle size={24} strokeWidth={3} /> };
      case "ERROR":
      case "DANGER":
        return { color: "bg-red-500", icon: <AlertTriangle size={24} strokeWidth={3} /> };
      default:
        return { color: "bg-blue-500", icon: <Info size={24} strokeWidth={3} /> };
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-green-500 mx-auto" size={48} />
        <p className="font-black italic uppercase text-slate-400">Đang lục tìm lịch sử...</p>
      </div>
    </div>
  );

  const notifications = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 min-h-[80vh] flex flex-col">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter text-center mb-12">
        NHẬT KÝ HOẠT ĐỘNG
      </h1>

      <div className="max-w-4xl mx-auto space-y-6 flex-grow w-full">
        {notifications.length === 0 ? (
          <div className="border-[3px] border-black p-20 rounded-[32px] bg-slate-50 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black italic uppercase text-slate-400">Chưa có hoạt động nào được ghi lại</p>
          </div>
        ) : (
          <>
            {notifications.map((n: any) => {
              const { color, icon } = getTagProps(n.type);
              return (
              <div 
                key={n.id}
                className={`group relative border-[3px] border-black p-6 rounded-[24px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  !n.isRead ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className={`p-3 border-2 border-black rounded-xl h-fit text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${color}`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase italic leading-tight mb-2">{n.title}</h3>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-4 italic">
                          {new Date(n.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>

                  {!n.isRead && (
                    <button title="Đánh dấu"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                    >
                      <CheckCircle size={18} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
              );
            })}

            {/* Điều khiển phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12 pb-8">
                <button title="Trang trước"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none transition-all active:translate-y-1"
                >
                  <ChevronLeft size={24} strokeWidth={3} />
                </button>

                <div className="px-6 py-2 border-[3px] border-black rounded-xl bg-yellow-300 font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {currentPage} / {totalPages}
                </div>

                <button title="Trang sau"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:shadow-none transition-all active:translate-y-1"
                >
                  <ChevronRight size={24} strokeWidth={3} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-center text-[10px] font-black text-slate-400 uppercase italic mt-auto pt-8">
        DTU PERSONALIZE SYSTEM V1.0 - NOTIFICATION LOG
      </p>
    </div>
  );
}