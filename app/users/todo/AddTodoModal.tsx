"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddTodoModal({
  isOpen,
  onClose,
  onSave,
  todo, // Nhận thêm prop todo nếu là đang sửa
}: any) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  // Đổ dữ liệu cũ vào form khi mở chế độ Sửa
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority);
    } else {
      setTitle("");
      setPriority("MEDIUM");
    }
  }, [todo, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 text-black font-sans">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border-[3px] border-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            {todo ? "Cập nhật" : "Nhiệm vụ mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full border-2 border-transparent active:border-black"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase mb-2 block text-slate-400">
              Tên nhiệm vụ
            </label>
            <input
              autoFocus
              className="w-full p-4 bg-slate-100 border-[3px] border-slate-900 rounded-2xl outline-none font-bold text-lg focus:bg-white transition-all"
              placeholder="Bạn cần làm gì?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase mb-2 block text-slate-400">
              Độ ưu tiên
            </label>
            <div className="flex gap-2">
              {["LOW", "MEDIUM", "HIGH"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl text-sm font-black border-[3px] transition-all text-black ${
                    priority === p
                      ? "border-black bg-blue-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onSave({ title, priority, id: todo?.id });
              setTitle("");
            }}
            className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase text-xl"
          >
            {todo ? "Lưu thay đổi" : "Tạo nhiệm vụ"}
          </button>
        </div>
      </div>
    </div>
  );
}
