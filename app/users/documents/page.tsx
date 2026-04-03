"use client";
import React, { useState } from "react";
import { useDocument } from "./hooks/useDocument";
import { DocumentHeader } from "./components/DocumentHeader";
import { DocumentTable } from "./components/DocumentTable";
import { UploadModal } from "./components/UploadModal";
import { X, Copy, ExternalLink, Check } from "lucide-react";
import { notifier } from "@/lib/notifier";

export default function DocumentPage() {
  const { documents, addDoc, removeDoc, loading } = useDocument();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      await removeDoc(id);
    }
  };

  const handlePreview = (url: string, type: string) => {
    const t = type?.toLowerCase() || "";
    setOriginalUrl(url);

    if (t.includes("pdf")) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`,
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(originalUrl);
    setCopied(true);
    // Báo sao chép thành công
    notifier.success("Thành công!", "Đã sao chép đường dẫn tài liệu.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-10 bg-white min-h-screen no-scrollbar">
      <DocumentHeader onAddClick={() => setIsModalOpen(true)} />

      <DocumentTable
        loading={loading}
        documents={documents}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addDoc}
      />

      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-8 backdrop-blur-md">
          <div className="bg-white w-full h-full rounded-[40px] border-[4px] border-black relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="p-2 border-black bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3 border-2 bg-white border-black px-4 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase italic text-slate-400 min-w-fit">
                  Link tài liệu:
                </span>
                <input
                  readOnly
                  value={originalUrl}
                  className="w-full text-xs font-bold text-green-600 outline-none bg-transparent truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <a
                  href={originalUrl}
                  target="_blank"
                  className="p-1 hover:bg-slate-100 rounded-md"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <button
                onClick={() => setPreviewUrl(null)}
                className="bg-red-500 text-white font-black p-3 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-y-1 active:shadow-none transition-all"
              >
                <X size={10} strokeWidth={4} />
              </button>
            </div>

            <div className="flex-1 bg-slate-200">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
