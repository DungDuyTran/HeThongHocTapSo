"use client";

import { useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { FileText, Download, Filter, BarChart3, Layers, ChevronRight, Loader2 } from "lucide-react";

export default function AdminReports() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Mặc định hiện 'users' (Học viên)
  const [viewDetail, setViewDetail] = useState<string | null>(null);

  const fetchReport = async () => {
    if (!dateRange.start || !dateRange.end) {
        alert("Vui lòng chọn đầy đủ khoảng thời gian!");
        return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/reports?start=${dateRange.start}&end=${dateRange.end}`);
      setReportData(res.data);
      setViewDetail('users'); 
    } catch (err) { 
      alert("Lỗi lấy dữ liệu báo cáo!"); 
    } finally { 
      setLoading(false); 
    }
  };

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

  return (
    <div className="space-y-8 p-4 w-full min-w-0">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-slate-800 italic tracking-tight">Thống kê & Báo cáo</h1>
        {reportData && (
          <button 
            onClick={exportToExcel} 
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all shrink-0 active:scale-95"
          >
            <Download size={20} /> 
            Xuất file {viewDetail === 'users' ? 'Người dùng' : viewDetail === 'docs' ? 'Tài liệu' : 'Flashcard'}
          </button>
        )}
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Từ ngày</p>
          <input title="Từ ngày" type="date" className="w-full p-3 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setDateRange({...dateRange, start: e.target.value})}/>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Đến ngày</p>
          <input title="Đến ngày" type="date" className="w-full p-3 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setDateRange({...dateRange, end: e.target.value})}/>
        </div>
        <button 
            disabled={loading}
            onClick={fetchReport} 
            className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 h-[52px] disabled:opacity-50 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Filter size={20} />} 
          {loading ? "Đang xử lý..." : "Tạo báo cáo"}
        </button>
      </div>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setViewDetail('users')}
              className={`p-8 rounded-3xl cursor-pointer transition-all border-l-8 shadow-md ${viewDetail === 'users' ? 'bg-blue-50 border-blue-600 scale-[1.02] shadow-blue-100' : 'bg-white border-blue-400 hover:bg-slate-50'}`}
            >
              <BarChart3 className="mb-2 text-blue-500" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Học viên mới</p>
              <h3 className="text-5xl font-black text-slate-800">{reportData.summary.newUsers}</h3>
            </div>

            <div 
              onClick={() => setViewDetail('docs')}
              className={`p-8 rounded-3xl cursor-pointer transition-all border-l-8 shadow-md ${viewDetail === 'docs' ? 'bg-green-50 border-green-600 scale-[1.02] shadow-green-100' : 'bg-white border-green-400 hover:bg-slate-50'}`}
            >
              <FileText className="mb-2 text-green-500" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tài liệu mới</p>
              <h3 className="text-5xl font-black text-slate-800">{reportData.summary.newDocs}</h3>
            </div>

            <div 
              onClick={() => setViewDetail('folders')}
              className={`p-8 rounded-3xl cursor-pointer transition-all border-l-8 shadow-md ${viewDetail === 'folders' ? 'bg-purple-50 border-purple-600 scale-[1.02] shadow-purple-100' : 'bg-white border-purple-400 hover:bg-slate-50'}`}
            >
              <Layers className="mb-2 text-purple-500" size={32} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flashcard</p>
              <h3 className="text-5xl font-black text-slate-800">{reportData.summary.newFolders}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">
                <ChevronRight size={18} className="text-blue-500" />
                Danh sách chi tiết: <span className="text-blue-600 uppercase underline">{viewDetail === 'users' ? 'Học viên' : viewDetail === 'docs' ? 'Tài liệu' : 'Thư mục Flashcard'}</span>
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    {viewDetail === 'users' ? (
                      <>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase">Họ Tên</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase">Email</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Ngày tham gia</th>
                      </>
                    ) : viewDetail === 'docs' ? (
                      <>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase">Tên tài liệu</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Định dạng</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Tải về</th> 
                      </>
                    ) : (
                      <>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase">Tên bộ Flashcard</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Mô tả</th>
                        <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Ngày tạo</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {viewDetail === "users" ? (
                    reportData.details.users.map((u: any, i: number) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-all group">
                        <td className="p-4 font-bold text-slate-700 group-hover:text-blue-600">{u["Tên"]}</td>
                        <td className="p-4 text-slate-500">{u["Email"]}</td>
                        <td className="p-4 text-slate-400 text-sm text-center">{u["Ngày tham gia"]}</td>
                      </tr>
                    ))
                  ) : viewDetail === "docs" ? (
                    reportData.details.documents.map((d: any, i: number) => (
                      <tr key={i} className="hover:bg-green-50/30 transition-all group">
                      <td className="p-4 font-bold text-slate-700 group-hover:text-green-600">
                      {d["Tên tài liệu"]}
                    </td>
                    <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase border border-slate-200">
                  {d["Loại file"]}
                    </span>
                      </td>
                    <td className="p-4">

                  <div className="flex justify-center items-center">
                  <a 
                    href={d.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold text-xs border border-blue-100 shadow-sm"
                  >
                  <Download size={14} />
                  <span>Tải xuống</span>
                  </a>
                  </div>
                  </td>
                </tr>
                  ))
                  ) : (
                    reportData.details.flashcards.map((f: any, i: number) => (
                      <tr key={i} className="hover:bg-purple-50/30 transition-all group">
                        <td className="p-4 font-bold text-slate-700 group-hover:text-purple-600">{f["Tên bộ thẻ"]}</td>
                        <td className="p-4 text-center text-slate-500 text-sm italic">
                          {f["Mô tả"]}
                        </td>
                        <td className="p-4 text-slate-400 text-sm text-center">
                          {f["Ngày tạo"]}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {reportData.details[viewDetail === 'users' ? 'users' : viewDetail === 'docs' ? 'documents' : 'flashcards'].length === 0 && (
                <div className="p-20 text-center text-slate-400 italic">
                    Không tìm thấy dữ liệu trong khoảng thời gian này.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}