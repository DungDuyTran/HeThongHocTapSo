"use client";
import React, { useState } from "react";
import { X, FileUp } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { notifier } from "@/lib/notifier"; // Thêm notifier

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export function UploadModal({ isOpen, onClose, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [fileInfo, setFileInfo] = useState<{
    url: string;
    size: string;
    type: string;
  } | null>(null);

  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userStr ? JSON.parse(userStr) : null;
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInfo) {
      notifier.warn("Vui lòng tải file từ thiết bị lên trước! ⚠️");
      return;
    }
    if (!title.trim()) {
      notifier.warn("Chưa nhập tiêu đề cho tài liệu! ⚠️");
      return;
    }

    onAdd({
      title: title,
      fileUrl: fileInfo.url,
      fileType: fileInfo.type,
      fileSize: fileInfo.size,
      userName: user?.hoTen,
    });

    setTitle("");
    setFileInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden border-[3px] border-black transition-all">
        <div className="p-6 border-b-[3px] border-black bg-green-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-green-600">
              <FileUp size={24} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-black uppercase italic font-serif tracking-tighter">
              Tải tài liệu lên
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 border-2 border-transparent hover:border-black rounded-xl transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[12px] font-black uppercase italic text-slate-500 ml-1">
              Tên tài liệu
            </label>
            <input
              required
              readOnly
              className="w-full p-4 border-[3px] border-black rounded-2xl outline-none bg-slate-100 text-slate-500 font-bold italic cursor-not-allowed"
              placeholder="Tên file..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-black uppercase italic text-slate-500 ml-1">
              Tệp tin từ thiết bị
            </label>
            <div className="border-[3px] border-dashed border-black p-8 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-4 hover:bg-slate-100 transition-colors">
              <UploadButton<OurFileRouter, "documentUploader">
                endpoint="documentUploader"
                headers={{
                  "x-user-id": user?.id?.toString() || "1",
                }}
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    const fileName = res[0].name;
                    const extension = fileName.split(".").pop()?.toLowerCase();

                    setTitle(fileName);
                    setFileInfo({
                      url: res[0].url,
                      size: (res[0].size / 1024 / 1024).toFixed(2) + " MB",
                      type: extension || "unknown",
                    });
                    // Báo thành công khi Upload lên Cloud xong
                    notifier.success(
                      "Đã tải lên mây! ",
                      "Bấm 'Lưu' để hoàn tất nhé.",
                    );
                    if (extension !== "docx" && extension !== "pdf") {
                      notifier.warn(
                        "Lưu ý: AI chỉ hỗ trợ tài liệu .docx và .pdf, vui lòng chỉnh sửa lại tài liệu nếu muốn sử dụng AI"
                      );
                    }
                  }
                }}
                onUploadProgress={(p) => {
                  console.log("Tiến độ: ", p);
                }}
                onUploadError={(error: Error) => {
                  notifier.error("Lỗi tải lên!", error.message);
                }}
                appearance={{
                  button:
                    "bg-black text-white font-black italic uppercase text-[10px] px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(22,163,74,1)] hover:bg-green-600 transition-all",
                  allowedContent:
                    "text-[10px] font-bold text-slate-400 uppercase mt-2",
                }}
              />
              {fileInfo && (
                <div className="flex items-center gap-2 bg-green-100 border-2 border-green-600 px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black text-green-700 italic uppercase">
                    Đã sẵn sàng ({fileInfo.size})
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!fileInfo}
            className="w-full bg-green-600 text-white font-black py-4 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase italic text-sm tracking-widest"
          >
            Lưu vào hệ thống
          </button>
        </form>
      </div>
    </div>
  );
}
