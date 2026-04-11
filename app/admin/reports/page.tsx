"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { 
  FileText, Download, Filter, BarChart3, 
  Layers, ChevronRight, Loader2, Calendar,
  ArrowUpRight, ChevronLeft
} from "lucide-react";

export default function AdminReports() {
  // Tự động set khoảng thời gian 30 ngày gần nhất
  const [dateRange, setDateRange] = useState({ 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewDetail, setViewDetail] = useState<string>('users');

  // Logic Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/reports?start=${dateRange.start}&end=${dateRange.end}`);
      setReportData(res.data);
      setCurrentPage(1); // Reset về trang 1 khi load dữ liệu mới
    } catch (err) { 
      console.error("Lỗi lấy dữ liệu báo cáo!"); 
    } finally { 
      setLoading(false); 
    }
  }, [dateRange.start, dateRange.end]);

  // TỰ ĐỘNG CHẠY KHI VÀO TRANG
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportToExcel = () => {
    if (!reportData || !viewDetail) return;
    let dataToExport = [];
    let fileName = "";

    if (viewDetail === 'users') {
      dataToExport = reportData.details.users;
      fileName = "Hoc_Vien_Moi";
    } else if (viewDetail === 'docs') {
      dataToExport = reportData.details.documents;
      fileName = "Tai_Lieu_Moi";
    } else {
      dataToExport = reportData.details.flashcards;
      fileName = "Bo_Flashcard_Moi";
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoChiTiet");
    XLSX.writeFile(workbook, `Bao_cao_${fileName}_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Lấy danh sách hiện tại dựa trên viewDetail
  const getActiveList = () => {
    if (!reportData) return [];
    if (viewDetail === 'users') return reportData.details.users;
    if (viewDetail === 'docs') return reportData.details.documents;
    return reportData.details.flashcards;
  };

  // 2. Tính toán phân trang
  const activeList = getActiveList();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activeList.length / itemsPerPage);

  return (
    <div className="space-y-8 min-h-screen pb-20 px-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">
          Thống kê & Báo cáo
        </h1>
        {reportData && (
          <button 
            onClick={exportToExcel} 
            className="flex items-center gap-3 bg-green-400 text-black border-2 border-black px-8 py-4 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none uppercase text-sm"
          >
            <Download size={22} /> Xuất file {viewDetail === 'users' ? 'Học viên' : viewDetail === 'docs' ? 'Tài liệu' : 'Flashcard'}
          </button>
        )}
      </div>

      {/* BỘ LỌC THỜI GIAN */}
      <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">
            <Calendar size={14} /> Từ ngày
          </label>
          <input title="Từ ngày"
            type="date" value={dateRange.start}
            className="w-full p-4 border-2 border-black rounded-2xl bg-slate-50 outline-none focus:bg-white font-bold transition-all" 
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">
            <Calendar size={14} /> Đến ngày
          </label>
          <input title="Đến ngày"
            type="date" value={dateRange.end}
            className="w-full p-4 border-2 border-black rounded-2xl bg-slate-50 outline-none focus:bg-white font-bold transition-all" 
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
        </div>
        <button 
          disabled={loading} onClick={fetchReport} 
          className="bg-blue-600 text-white p-4 rounded-2xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 h-[60px] disabled:opacity-50 active:translate-y-0.5 active:shadow-none uppercase italic"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Filter size={24} />} Lọc dữ liệu
        </button>
      </div>

      {reportData ? (
        <div className="space-y-10">
          {/* CARDS TỔNG QUAN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => {setViewDetail('users'); setCurrentPage(1);}}
              className={`p-8 rounded-[32px] cursor-pointer border-2 border-black transition-all group ${viewDetail === 'users' ? 'bg-blue-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px]' : 'bg-white hover:bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <div className="flex justify-between items-start mb-4"><BarChart3 size={40} className="text-black" /><ArrowUpRight className="opacity-0 group-hover:opacity-100" /></div>
              <p className="text-xs font-black text-black/60 uppercase tracking-widest mb-1">Học viên mới</p>
              <h3 className="text-6xl font-black text-black leading-none">{reportData.summary.newUsers}</h3>
            </div>

            <div 
              onClick={() => {setViewDetail('docs'); setCurrentPage(1);}}
              className={`p-8 rounded-[32px] cursor-pointer border-2 border-black transition-all group ${viewDetail === 'docs' ? 'bg-green-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px]' : 'bg-white hover:bg-green-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <div className="flex justify-between items-start mb-4"><FileText size={40} className="text-black" /><ArrowUpRight className="opacity-0 group-hover:opacity-100" /></div>
              <p className="text-xs font-black text-black/60 uppercase tracking-widest mb-1">Tài liệu mới</p>
              <h3 className="text-6xl font-black text-black leading-none">{reportData.summary.newDocs}</h3>
            </div>

            <div 
              onClick={() => {setViewDetail('folders'); setCurrentPage(1);}}
              className={`p-8 rounded-[32px] cursor-pointer border-2 border-black transition-all group ${viewDetail === 'folders' ? 'bg-purple-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px]' : 'bg-white hover:bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <div className="flex justify-between items-start mb-4"><Layers size={40} className="text-black" /><ArrowUpRight className="opacity-0 group-hover:opacity-100" /></div>
              <p className="text-xs font-black text-black/60 uppercase tracking-widest mb-1">Flashcard mới</p>
              <h3 className="text-6xl font-black text-black leading-none">{reportData.summary.newFolders}</h3>
            </div>
          </div>

          {/* BẢNG CHI TIẾT CÓ PHÂN TRANG */}
          <div className="bg-white rounded-[40px] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-8 border-b-2 border-black bg-yellow-400 flex justify-between items-center">
              <h4 className="font-black text-xl text-black flex items-center gap-3 uppercase italic">
                <ChevronRight size={24} className="bg-black text-white rounded-full p-1" />
                Dữ liệu chi tiết: <span className="underline decoration-black decoration-4">{viewDetail === 'users' ? 'Học viên' : viewDetail === 'docs' ? 'Tài liệu' : 'Flashcard'}</span>
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b-2 border-black">
                  <tr>
                    {viewDetail === 'users' ? (
                      <>
                        <th className="p-6 text-xs font-black uppercase">Họ Tên</th>
                        <th className="p-6 text-xs font-black uppercase">Email</th>
                        <th className="p-6 text-xs font-black uppercase text-center">Ngày tham gia</th>
                      </>
                    ) : viewDetail === 'docs' ? (
                      <>
                        <th className="p-6 text-xs font-black uppercase">Tên tài liệu</th>
                        <th className="p-6 text-xs font-black uppercase text-center">Định dạng</th>
                        <th className="p-6 text-xs font-black uppercase text-center">Hành động</th>
                      </>
                    ) : (
                      <>
                        <th className="p-6 text-xs font-black uppercase">Tên bộ thẻ</th>
                        <th className="p-6 text-xs font-black uppercase text-center">Mô tả</th>
                        <th className="p-6 text-xs font-black uppercase text-center">Ngày tạo</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-bold">
                  {currentItems.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-all group">
                      {viewDetail === 'users' ? (
                        <>
                          <td className="p-6 text-slate-700">{item["Tên"]}</td>
                          <td className="p-6 text-slate-500">{item["Email"]}</td>
                          <td className="p-6 text-center text-slate-400 text-xs">{item["Ngày tham gia"]}</td>
                        </>
                      ) : viewDetail === 'docs' ? (
                        <>
                          <td className="p-6 text-slate-700">{item["Tên tài liệu"]}</td>
                          <td className="p-6 text-center"><span className="bg-black text-white px-2 py-1 rounded-md text-[10px]">{item["Loại file"]}</span></td>
                          <td className="p-6 flex justify-center">
                            <a href={item.url} target="_blank" className="p-2 border-2 border-black rounded-lg hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Download size={14} /></a>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-6 text-slate-700">{item["Tên bộ thẻ"]}</td>
                          <td className="p-6 text-slate-500 italic text-sm">{item["Mô tả"] || "Trống"}</td>
                          <td className="p-6 text-center text-slate-400 text-xs">{item["Ngày tạo"]}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* THANH PHÂN TRANG */}
              {totalPages > 1 && (
                <div className="p-6 bg-slate-50 border-t-2 border-black flex justify-center items-center gap-6">
                  <button title="Trang trước"
                    disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border-2 border-black rounded-xl hover:bg-white disabled:opacity-30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-black text-sm uppercase italic">Trang {currentPage} / {totalPages}</span>
                  <button title="Trang sau"
                    disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border-2 border-black rounded-xl hover:bg-white disabled:opacity-30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-40">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="font-black text-slate-400 uppercase tracking-widest">Đang đồng bộ dữ liệu...</p>
        </div>
      )}
    </div>
  );
}