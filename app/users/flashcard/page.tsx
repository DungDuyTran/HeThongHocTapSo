"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { Plus, Folder } from "lucide-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function FlashcardHub() {
  const router = useRouter();
  const { data: folders, mutate } = useSWR("/api/flashcard/folder", fetcher);

  const handleCreateFolder = async () => {
    const name = prompt("Nhập tên thư mục mới:");
    if (name) {
      await axios.post("/api/flashcard/folder", { name });
      mutate();
    }
  };

  return (
    <div className="p-10 bg-white min-h-screen text-black  origin-top-left w-full">
      <header className="flex justify-between items-end border-b-4 border-black pb-8 mb-10">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic">
          Thư viện Flashcard
        </h1>
        <button
          onClick={handleCreateFolder}
          className="p-4 bg-blue-600 text-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold active:shadow-none active:translate-y-1 transition-all"
        >
          + TẠO THƯ MỤC
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {folders?.map((f: any) => (
          <div
            key={f.id}
            onClick={() => router.push(`/users/flashcard/${f.id}`)}
            className="p-8 border-4 border-black rounded-[40px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-yellow-50 cursor-pointer transition-all"
          >
            <Folder size={40} className="mb-4 text-blue-600" strokeWidth={3} />
            <h3 className="text-2xl font-black italic mb-2">{f.name}</h3>
            <p className="font-bold text-slate-400">
              {f._count?.cards || 0} Thẻ ghi nhớ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
