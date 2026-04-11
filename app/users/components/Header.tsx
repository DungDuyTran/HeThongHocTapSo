"use client";
import React from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Header({ isCollapsed, setIsCollapsed }: HeaderProps) {
  const { data: profile } = useSWR("/api/user/profile", fetcher);
  const hoTen = profile?.hoTen || "Đang tải...";
  const roleText =
    profile?.vaiTro === "ADMIN" ? "Admin @ DTU" : "Student @ DTU";

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    hoTen,
  )}&background=f8fafc&color=16a34a&bold=true&size=128&border=true`;

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 z-30 relative shadow-xl border-b-2 border-black/5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 border-2 border-black rounded-lg hover:bg-slate-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col select-none">
          <span className="text-lg font-black italic tracking-tighter uppercase leading-none">
            Trợ lý học tập
          </span>
          <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">
            Ecosystem
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-1.5 border-2 border-black rounded-lg bg-white hover:bg-green-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 transition-all">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-black">
            2
          </span>
        </button>

        <Link
          href="/users/profile"
          className="flex items-center gap-3 pl-4 border-l-2 border-slate-100 cursor-pointer group select-none transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black uppercase leading-none group-hover:text-green-600 transition-colors">
              {hoTen}
            </p>
            <p className="text-[9px] font-bold text-green-600 uppercase mt-1">
              {roleText}
            </p>
          </div>

          <div className="relative">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 object-cover bg-green-50 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[0.5px] group-hover:translate-y-[0.5px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
        </Link>
      </div>
    </header>
  );
}
