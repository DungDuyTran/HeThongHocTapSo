"use client";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { useTodoStore } from "@/stores/useTodoStore";
import { format } from "date-fns";
import AddTodoModal from "./AddTodoModal";
import { Trash2, Edit3, CheckCircle2, Plus } from "lucide-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function TodoList() {
  const { selectedDate } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: todos, mutate } = useSWR(`/api/todo?date=${dateStr}`, fetcher);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    await axios.patch(`/api/todo/${id}`, { status: !currentStatus });
    mutate();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận xóa nhiệm vụ này?")) {
      await axios.delete(`/api/todo/${id}`);
      mutate();
    }
  };

  const handleSaveTodo = async (formData: any) => {
    try {
      if (formData.id) {
        await axios.patch(`/api/todo/${formData.id}`, {
          title: formData.title,
          priority: formData.priority,
        });
      } else {
        await axios.post("/api/todo", {
          ...formData,
          targetDate: selectedDate,
        });
      }
      setIsModalOpen(false);
      setEditingTodo(null);
      mutate();
    } catch (err) {
      alert("Lỗi hệ thống!");
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen font-sans text-black">
      <div className="max-w-4xl mx-auto">
        {/* Header Tối Ưu: Tiêu đề trái - Ngày & Nút Add phải */}
        <header className="mb-6 border-b-[4px] border-black pb-4 flex justify-between items-center">
          <div>
            <p className="text-blue-700 font-black mb-0.5 uppercase tracking-widest text-[10px]">
              Tasks
            </p>
            <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tighter leading-none">
              {format(selectedDate, "eeee")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Tag Ngày Tháng */}
            <span className="text-xl font-black text-slate-900 border-[3px] border-black px-3 py-1.5 bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {format(selectedDate, "dd/MM")}
            </span>

            {/* NÚT THÊM MỚI (Dấu cộng) - Đặt ngay cạnh ngày */}
            <button
              onClick={() => {
                setEditingTodo(null);
                setIsModalOpen(true);
              }}
              className="p-2 bg-blue-600 text-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              title="Thêm nhiệm vụ"
            >
              <Plus size={24} strokeWidth={4} />
            </button>
          </div>
        </header>

        {/* Danh sách nhiệm vụ nhỏ gọn (space-y-2) */}
        <div className="space-y-2.5">
          {todos?.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3.5 border-[3px] border-black rounded-[20px] bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() => handleToggle(todo.id, todo.status)}
                    className="peer appearance-none w-7 h-7 border-[3px] border-black rounded-lg checked:bg-blue-500 cursor-pointer transition-colors"
                  />
                  <CheckCircle2
                    className="absolute pointer-events-none text-white opacity-0 peer-checked:opacity-100 left-1 top-1"
                    size={18}
                    strokeWidth={4}
                  />
                </div>

                <div className="flex flex-col">
                  <h3
                    className={`text-lg font-black leading-tight tracking-tight ${todo.status ? "line-through text-slate-300" : "text-slate-900"}`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex gap-2">
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-black mt-1 inline-block ${
                        todo.priority === "HIGH"
                          ? "bg-red-400"
                          : todo.priority === "MEDIUM"
                            ? "bg-amber-400"
                            : "bg-green-400"
                      }`}
                    >
                      {todo.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút thao tác nhỏ gọn hơn */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTodo(todo);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 bg-white border-[2px] border-black rounded-lg hover:bg-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <Edit3 size={16} className="text-black stroke-[3]" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1.5 bg-white border-[2px] border-black rounded-lg hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  <Trash2 size={16} className="stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        todo={editingTodo}
      />
    </div>
  );
}
