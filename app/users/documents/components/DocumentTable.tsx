"use client";
import {
  FileText,
  FileSpreadsheet,
  Trash2,
  Eye,
  Download,
  FileJson,
  Presentation,
  FileCode,
  File as FileIcon,
} from "lucide-react";

export function DocumentTable({
  loading,
  documents = [], 
  onDelete,
  onPreview,
}: any) {
  const getFileStyle = (type: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("pdf"))
      return {
        icon: <FileText size={24} />,
        color: "text-red-500",
        bg: "bg-red-50",
      };
    if (t.includes("doc"))
      return {
        icon: <FileText size={24} />,
        color: "text-blue-500",
        bg: "bg-blue-50",
      };
    if (t.includes("xls") || t.includes("sheet") || t.includes("csv"))
      return {
        icon: <FileSpreadsheet size={24} />,
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (t.includes("ppt"))
      return {
        icon: <Presentation size={24} />,
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    if (t.includes("json") || t.includes("js") || t.includes("ts"))
      return {
        icon: <FileCode size={24} />,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return {
      icon: <FileIcon size={24} />,
      color: "text-slate-400",
      bg: "bg-slate-50",
    };
  };

  return (
    <div className="mt-4 bg-white overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-500">
            <th className="p-4 text-[11px] font-black uppercase text-slate-600 italic">
              Tài liệu học tập
            </th>
            <th className="p-4 text-[11px] font-black uppercase text-slate-600 text-center italic">
              Định dạng
            </th>
            <th className="p-4 text-[11px] font-black uppercase text-slate-600 text-center italic">
              Dung lượng
            </th>
            <th className="p-4 text-[11px] font-black uppercase text-slate-600 text-right italic">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={4}
                className="p-20 text-center text-green-600 font-black animate-pulse text-xl"
              >
                ĐANG ĐỒNG BỘ...
              </td>
            </tr>
          ) : documents.length === 0 ? ( 
            <tr>
              <td
                colSpan={4}
                className="p-20 text-center text-slate-400 font-bold italic text-base"
              >
                KHO TÀI LIỆU ĐANG TRỐNG... 
              </td>
            </tr>
          ) : (
            documents.map((doc: any) => {
              const style = getFileStyle(doc.fileType);
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/50 transition-colors border-b border-slate-50"
                >
                  <td className="p-4 flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl border border-slate-100 ${style.bg} ${style.color}`}
                    >
                      {style.icon}
                    </div>

                    <span className="font-bold text-slate-800 text-base tracking-tight leading-tight uppercase italic font-serif truncate max-w-[300px]">
                      {doc.title}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-[9px] font-black px-2 py-1 rounded-md border uppercase ${style.color} border-current`}
                    >
                      {doc.fileType || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-center text-[11px] font-bold text-slate-400 uppercase italic">
                    {doc.fileSize || "0 KB"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        title="Xem trước"
                        onClick={() => onPreview(doc.fileUrl, doc.fileType)}
                        className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                      >
                        <Eye size={20} />
                      </button>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <Download size={20} />
                      </a>
                      <button 
                        title="Xóa tài liệu"
                        onClick={() => onDelete(doc.id)}
                        className="p-2.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}