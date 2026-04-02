"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Search, Calendar, UserPlus, FileText, 
  Layers, Clock, Filter, Loader2, Info 
} from "lucide-react";

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);

      const res = await axios.get(`/api/admin/activities?${params.toString()}`);
      setActivities(res.data);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Hàm render Icon dựa trên loại hoạt động
  const getIcon = (type: string) => {
    switch (type) {
      case "USER": return <UserPlus className="text-blue-500" size={20} />;
      case "DOC": return <FileText className="text-emerald-500" size={20} />;
      case "FLASHCARD": return <Layers className="text-purple-500" size={20} />;
      default: return <Clock className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="space-y-6 min-h-screen pb-10">
      <h1 className="text-3xl font-bold text-gray-800 italic">Theo dõi hoạt động</h1>

      {/* THANH CÔNG CỤ: TÌM KIẾM & LỌC */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          />
        </div>
        <input title="Ngày"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
        />
        <div className="flex gap-2">
          <input title="Ngày"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          />
          <button title="?"
            onClick={fetchActivities}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all shadow-md shadow-blue-100"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH TIMELINE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Đang đồng bộ hoạt động...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Không tìm thấy hoạt động nào.</div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-center justify-between group">
                <div className="flex items-center w-full">
                  {/* Icon Node */}
                  <div className="absolute left-0 h-10 w-10 flex items-center justify-center bg-white border-2 border-slate-100 rounded-full shadow-sm z-10 group-hover:border-blue-200 transition-colors">
                    {getIcon(act.type)}
                  </div>

                  {/* Content Card */}
                  <div className="ml-14 flex-1 bg-slate-50/50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800">{act.userName}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(act.time).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        act.type === 'USER' ? 'bg-blue-100 text-blue-600' : 
                        act.type === 'DOC' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {act.action}
                      </span>
                      <p className="text-sm text-slate-600 italic truncate">{act.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}