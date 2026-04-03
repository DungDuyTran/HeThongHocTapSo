"use client";
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { notifier } from "@/lib/notifier"; // Import notifier

export default function CategoryModal({ categories, onSync, onClose }: any) {
  const [newCate, setNewCate] = useState({ name: "", color: "#16a34a" });

  const handleAdd = () => {
    if (!newCate.name.trim()) {
      notifier.error("Lỗi!", "Vui lòng nhập tên thể loại.");
      return;
    }
    onSync([...categories, { ...newCate, id: Date.now().toString() }]);
    setNewCate({ name: "", color: "#16a34a" });
    notifier.success("Thành công!", "Đã thêm thể loại mới.");
  };

  const handleDelete = (id: string) => {
    onSync(categories.filter((x: any) => x.id !== id));
    notifier.warn("Thể loại đã được gỡ khỏi danh sách.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black p-8 rounded-[40px] w-full max-w-md shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-6 italic border-b-2 border-black pb-2">
          Thể loại & Màu sắc
        </h3>
        <div className="flex gap-2 mb-8">
          <input
            value={newCate.name}
            onChange={(e) => setNewCate({ ...newCate, name: e.target.value })}
            className="flex-1 p-2 border-2 border-black rounded-xl font-bold text-xs"
            placeholder="Tên loại..."
          />
          <input
            type="color"
            value={newCate.color}
            onChange={(e) => setNewCate({ ...newCate, color: e.target.value })}
            className="w-12 h-10 border-2 border-black rounded-xl cursor-pointer"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
          {categories.map((c: any) => (
            <div
              key={c.id}
              className="flex justify-between items-center p-3 border-2 border-black rounded-xl font-bold text-xs"
              style={{ borderLeft: `10px solid ${c.color}` }}
            >
              {c.name}
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-black text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_#16a34a] active:shadow-none active:translate-y-1 transition-all"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
