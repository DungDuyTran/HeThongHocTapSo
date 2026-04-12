"use client";
import React, { useState } from "react";
import { Plus, X, Pencil, Check, RotateCcw } from "lucide-react";
import { notifier } from "@/lib/notifier";

export default function CategoryModal({ categories, onSync, onClose }: any) {
  const [newCate, setNewCate] = useState({ name: "", color: "#16a34a" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!newCate.name.trim()) {
      notifier.error("Lỗi!", "Vui lòng nhập tên thể loại.");
      return;
    }

    if (editingId) {
      // TRƯỜNG HỢP: ĐANG SỬA
      const updatedCategories = categories.map((c: any) =>
        c.id === editingId ? { ...newCate, id: editingId } : c,
      );
      onSync(updatedCategories);
      setEditingId(null);
      notifier.success("Thành công!", "Đã cập nhật thể loại.");
    } else {
      // TRƯỜNG HỢP: THÊM MỚI
      onSync([...categories, { ...newCate, id: Date.now().toString() }]);
      notifier.success("Thành công!", "Đã thêm thể loại mới.");
    }

    // Reset form
    setNewCate({ name: "", color: "#16a34a" });
  };

  const handleEditClick = (category: any) => {
    setEditingId(category.id);
    setNewCate({ name: category.name, color: category.color });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewCate({ name: "", color: "#16a34a" });
  };

  const handleDelete = (id: string) => {
    if (editingId === id) cancelEdit();
    onSync(categories.filter((x: any) => x.id !== id));
    notifier.warn("Thể loại đã được gỡ khỏi danh sách.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border-2 border-black p-8 rounded-[40px] w-full max-w-md shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-6 italic border-b-2 border-black pb-2 flex justify-between items-center">
          {editingId ? "Chỉnh sửa thể loại" : "Thể loại & Màu sắc"}
          {editingId && (
            <button
              onClick={cancelEdit}
              className="text-[10px] bg-slate-100 px-2 py-1 rounded border border-black flex items-center gap-1 hover:bg-slate-200"
            >
              <RotateCcw size={10} /> Hủy sửa
            </button>
          )}
        </h3>

        {/* KHU VỰC NHẬP LIỆU / CHỈNH SỬA */}
        <div
          className={`flex gap-2 mb-8 p-3 rounded-2xl border-2 transition-all ${editingId ? "border-yellow-400 bg-yellow-50" : "border-black bg-white"}`}
        >
          <input
            value={newCate.name}
            onChange={(e) => setNewCate({ ...newCate, name: e.target.value })}
            className="flex-1 p-2 border-2 border-black rounded-xl font-bold text-xs outline-none focus:bg-white"
            placeholder="Tên loại..."
          />
          <input
            type="color"
            value={newCate.color}
            onChange={(e) => setNewCate({ ...newCate, color: e.target.value })}
            className="w-12 h-10 border-2 border-black rounded-xl cursor-pointer"
          />
          <button
            onClick={handleSave}
            className={`${editingId ? "bg-yellow-400" : "bg-green-600"} text-black p-2 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all`}
          >
            {editingId ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <Plus size={18} strokeWidth={3} />
            )}
          </button>
        </div>

        {/* DANH SÁCH THỂ LOẠI */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
          {categories.map((c: any) => (
            <div
              key={c.id}
              className={`flex justify-between items-center p-3 border-2 border-black rounded-xl font-bold text-xs transition-all ${editingId === c.id ? "opacity-40 scale-95" : "opacity-100"}`}
              style={{ borderLeft: `10px solid ${c.color}` }}
            >
              <span className="truncate mr-2">{c.name}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEditClick(c)}
                  className="p-1.5 hover:bg-yellow-100 rounded-lg text-slate-600 transition-colors"
                  title="Sửa"
                >
                  <Pencil size={14} strokeWidth={3} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  title="Xóa"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
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
