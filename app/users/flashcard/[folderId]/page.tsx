"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ArrowLeft,
  RotateCcw,
  Edit3,
} from "lucide-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function FolderManagementPage() {
  const { folderId } = useParams();
  const router = useRouter();

  // Gọi dữ liệu từ API Card
  const { data: cards, mutate } = useSWR(
    `/api/flashcard/card?folderId=${folderId}`,
    fetcher,
  );

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ front: "", back: "" });

  const handleAddCard = async () => {
    if (!newCard.front || !newCard.back)
      return alert("Dũng ơi, nhập đủ 2 mặt đã nhé!");
    await axios.post("/api/flashcard/card", {
      ...newCard,
      folderId: parseInt(folderId as string),
    });
    setNewCard({ front: "", back: "" });
    mutate(); // Load lại danh sách ngay lập tức
  };

  const handleDeleteCard = async (id: number) => {
    if (confirm("Xóa thẻ này khỏi bộ sưu tập?")) {
      await axios.delete(`/api/flashcard/card?id=${id}`);
      mutate();
    }
  };

  const currentCard = cards?.[index];

  return (
    // Sử dụng nền trắng (bg-white) và scale để hiển thị được nhiều hơn
    <div className="p-8 max-w-6xl mx-auto space-y-10 scale-[0.88] origin-top text-black bg-white min-h-screen">
      {/* 1. HEADER ĐIỀU HƯỚNG */}
      <header className="flex justify-between items-center border-b-[4px] border-black pb-6">
        <button
          onClick={() => router.push("/users/flashcard")}
          className="flex items-center gap-2 font-black p-3 border-[3px] border-black rounded-2xl hover:bg-slate-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none uppercase text-sm"
        >
          <ArrowLeft size={20} strokeWidth={3} /> Quay lại kho
        </button>

        <div className="text-center">
          <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-1">
            Folder Detail
          </p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Chi tiết thư mục
          </h1>
        </div>

        <button
          onClick={() => router.push(`/users/flashcard/${folderId}/quiz`)}
          className="bg-red-500 text-white font-black border-[4px] border-black px-8 py-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-2 active:shadow-none active:translate-y-1 transition-all uppercase italic"
        >
          <Zap fill="white" /> Bắt đầu kiểm tra
        </button>
      </header>

      {/* 2. KHU VỰC ÔN TẬP (Lật thẻ như cuốn sách) */}
      <section className="bg-slate-50 p-10 rounded-[50px] border-[4px] border-black border-dashed">
        <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
          <span className="bg-yellow-400 p-1 border-2 border-black rounded-lg">
            📖
          </span>{" "}
          Chế độ học tập
        </h2>

        <div
          onClick={() => setFlipped(!flipped)}
          className={`h-[380px] w-full bg-white border-[6px] border-black rounded-[50px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-12 cursor-pointer transition-all duration-500 active:scale-95 ${flipped ? "bg-blue-50" : ""}`}
        >
          <p className="text-xs font-black uppercase text-blue-600 mb-6 tracking-widest">
            {flipped ? "Mặt sau (Đáp án)" : "Mặt trước (Câu hỏi)"}
          </p>
          <h2 className="text-5xl font-black text-center leading-tight tracking-tighter uppercase italic">
            {cards?.length > 0
              ? flipped
                ? currentCard?.back
                : currentCard?.front
              : "Folder này còn trống"}
          </h2>
          <p className="mt-10 font-black text-slate-300 flex items-center gap-2 underline uppercase text-[10px]">
            <RotateCcw size={14} /> Nhấn vào thẻ để xem mặt kia
          </p>
        </div>

        {/* Nút lật trang */}
        <div className="flex justify-center items-center gap-12 mt-10">
          <button
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index - 1);
              setFlipped(false);
            }}
            className="p-5 border-[4px] border-black rounded-full bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-20 active:shadow-none transition-all"
          >
            <ChevronLeft strokeWidth={4} size={32} />
          </button>
          <span className="text-4xl font-black italic tabular-nums">
            {cards?.length > 0 ? index + 1 : 0}{" "}
            <span className="text-slate-300">/</span> {cards?.length || 0}
          </span>
          <button
            disabled={index === cards?.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index + 1);
              setFlipped(false);
            }}
            className="p-5 border-[4px] border-black rounded-full bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-20 active:shadow-none transition-all"
          >
            <ChevronRight strokeWidth={4} size={32} />
          </button>
        </div>
      </section>

      {/* 3. QUẢN LÝ THẺ (THÊM / XÓA) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
        {/* Form thêm thẻ */}
        <div className="p-8 border-[4px] border-black rounded-[40px] bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black mb-8 uppercase italic border-b-2 border-black pb-2 inline-block">
            Thêm thẻ mới
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Câu hỏi (Mặt trước)
              </label>
              <input
                value={newCard.front}
                onChange={(e) =>
                  setNewCard({ ...newCard, front: e.target.value })
                }
                placeholder="Ví dụ: OOP là gì?"
                className="w-full p-4 border-[3px] border-black rounded-2xl font-bold bg-slate-50 focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Đáp án (Mặt sau)
              </label>
              <textarea
                value={newCard.back}
                onChange={(e) =>
                  setNewCard({ ...newCard, back: e.target.value })
                }
                placeholder="Nhập câu trả lời chi tiết..."
                className="w-full p-4 border-[3px] border-black rounded-2xl font-bold bg-slate-50 focus:bg-white h-32 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleAddCard}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 active:shadow-none active:translate-y-1 transition-all uppercase text-lg"
            >
              <Plus className="inline-block mr-2" strokeWidth={4} /> Tạo thẻ
              ngay
            </button>
          </div>
        </div>

        {/* Danh sách thẻ để xóa/sửa */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-black uppercase mb-6 italic">
            Danh sách thẻ ({cards?.length || 0})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {cards?.map((card: any) => (
              <div
                key={card.id}
                className="p-4 border-[3px] border-black rounded-2xl bg-white flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition-all"
              >
                <div className="truncate pr-4">
                  <p className="font-black text-slate-900 truncate uppercase text-sm">
                    {card.front}
                  </p>
                  <p className="text-xs font-bold text-slate-400 truncate italic mt-1">
                    {card.back}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white border-2 border-black rounded-lg hover:bg-amber-400 transition-all">
                    <Edit3 size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 bg-white border-2 border-black rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
