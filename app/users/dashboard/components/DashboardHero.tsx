"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function DashboardHero({ name }: { name: string }) {
  const router = useRouter();

  return (
    <section className="lg:w-[62%] p-10 border-[3px] border-black rounded-[40px] bg-white flex flex-col justify-center relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Pattern trang trí mờ phía sau */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full border-l-2 border-b-2 border-black/5 opacity-50"></div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tighter italic leading-[0.9]">
          Hệ sinh thái <br />
          <span className="text-green-600 underline decoration-black decoration-4 underline-offset-8 mt-2">
            Học tập thông minh
          </span>
        </h1>
        <p className="text-lg text-slate-600 font-bold mb-10 italic max-w-md leading-relaxed">
          Chào {name}! khóa luận tốt nghiệp đang đến gần, hãy cùng nhau kiểm
          soát lộ trình hôm này nhé!!!
        </p>
        <button
          onClick={() => router.push("/users/calendar")}
          className="px-8 py-4 bg-green-600 text-white font-black border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] hover:bg-green-700 active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 uppercase text-xs italic tracking-widest"
        >
          Bắt đầu học tập <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </section>
  );
}
