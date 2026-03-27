"use client";
import React from "react";
import { Trash2, X } from "lucide-react";

export default function EventModal({
  type,
  form,
  setForm,
  categories,
  onClose,
  onSave,
  onDelete,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border-2 border-black p-8 rounded-[40px] w-full max-w-md shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] space-y-5">
        <h2 className="text-2xl font-black uppercase italic border-b-2 border-black pb-2">
          {type === "add" ? "Thêm hoạt động" : "Cập nhật lịch"}
        </h2>
        <div className="space-y-4 font-bold">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border-2 border-black rounded-xl bg-slate-50 focus:bg-white outline-none"
            placeholder="Tên công việc..."
          />
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full p-3 border-2 border-black rounded-xl bg-slate-50 h-24 outline-none"
            placeholder="Ghi chú nội dung..."
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full p-3 border-2 border-black rounded-xl bg-white outline-none"
          >
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="p-2 border-2 border-black rounded-lg text-[10px]"
            />
            <input
              type="datetime-local"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="p-2 border-2 border-black rounded-lg text-[10px]"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            className="flex-1 bg-green-600 text-white font-black py-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none uppercase"
          >
            Lưu
          </button>
          {type === "edit" && (
            <button
              onClick={onDelete}
              className="px-4 bg-red-100 text-red-600 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 bg-slate-100 font-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none uppercase text-xs"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
