"use client";
import React from "react";
import { format } from "date-fns";
import { Trash2, Edit3, Plus } from "lucide-react";
import { useTodo } from "../hooks/useTodo";
import AddTodoModal from "./AddTodoModal";

export default function TodoList() {
  const {
    todos,
    selectedDate,
    isModalOpen,
    setIsModalOpen,
    editingTodo,
    setEditingTodo,
    handleToggle,
    handleDelete,
    handleSaveTodo,
  } = useTodo(); // Lấy mọi thứ từ Hook

  return (
    <div className="flex-1 p-6 bg-white min-h-screen text-black">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 border-b-[4px] border-black pb-4 flex justify-between items-center">
          <div>
            <p className="text-green-700 font-black uppercase text-[10px]">
              Tasks
            </p>
            <h1 className="text-4xl font-black italic">
              {format(selectedDate, "eeee")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black border-[3px] border-black px-3 py-1.5 bg-yellow-400 shadow-[4px_4px_0px_0px_#000]">
              {format(selectedDate, "dd/MM")}
            </span>
            <button
              onClick={() => {
                setEditingTodo(null);
                setIsModalOpen(true);
              }}
              className="p-2 bg-green-600 text-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000]"
            >
              <Plus size={24} strokeWidth={4} />
            </button>
          </div>
        </header>

        <div className="space-y-2.5">
          {todos?.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3.5 border-[3px] border-black rounded-[20px] bg-white shadow-[5px_5px_0px_0px_#000]"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={todo.status}
                  onChange={() => handleToggle(todo.id, todo.status)}
                  className="w-7 h-7 border-[3px] border-black rounded-lg checked:bg-blue-500 cursor-pointer transition-all"
                />
                <div>
                  <h3
                    className={`text-lg font-black ${todo.status ? "line-through text-slate-300" : "text-slate-900"}`}
                  >
                    {todo.title}
                  </h3>
                  <span
                    className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-black mt-1 inline-block ${todo.priority === "HIGH" ? "bg-red-400" : todo.priority === "MEDIUM" ? "bg-amber-400" : "bg-green-400"}`}
                  >
                    {todo.priority}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTodo(todo);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-amber-400 shadow-[2px_2px_0px_0px_#000]"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1.5 bg-white border-2 border-black rounded-lg hover:bg-red-500 shadow-[2px_2px_0px_0px_#000]"
                >
                  <Trash2 size={16} />
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
