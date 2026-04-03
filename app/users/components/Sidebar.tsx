"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  LogOut,
  FileText,
  StickyNote,
} from "lucide-react";
import { notifier } from "@/lib/notifier";

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    const isConfirmed = confirm(
      "Bạn có chắc chắn muốn đăng xuất tài khoản không?",
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        notifier.success("Đã đăng xuất!", "Hẹn gặp lại bạn sớm nhé! ");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        notifier.error("Lỗi!", "Không thể đăng xuất vào lúc này.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notifier.error("Lỗi hệ thống!", "Vui lòng thử lại sau.");
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={28} />, label: "Tổng quan", path: "/users" },
    {
      icon: <Calendar size={28} />,
      label: "Thời gian biểu",
      path: "/users/calendar",
    },
    {
      icon: <CheckSquare size={28} />,
      label: "Todo List",
      path: "/users/todo",
    },
    {
      icon: <FileText size={28} />,
      label: "Tài liệu",
      path: "/users/documents",
    },
    {
      icon: <StickyNote size={28} />,
      label: "Ghi chú",
      path: "/users/notes",
    },
    {
      icon: <BarChart3 size={28} />,
      label: "Thống kê",
      path: "/users/statistics",
    },
    {
      icon: <BookOpen size={28} />,
      label: "Flashcard",
      path: "/users/flashcard",
    },
  ];

  return (
    <aside
      className={`bg-white shadow-2xl transition-all duration-300 flex flex-col z-20 ${
        isCollapsed ? "w-18" : "w-60"
      }`}
    >
      <nav className="flex-1 p-3 space-y-3 mt-2 shadow-2xl border-black">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg font-bold text-sm transition-all border-2 ${
              pathname === item.path
                ? "bg-green-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                : "bg-white text-black border-black  hover:bg-green-100 shadow-xl"
            }`}
          >
            <span className="min-w-[18px]">{item.icon}</span>

            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* 2. Nút Đăng xuất */}
      <div className="p-3 bg-white shadow-2xl border-t-2 border-gray-400">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2 bg-green-600 text-white font-bold text-sm hover:bg-green-800 rounded-lg transition-all flex justify-center active:translate-y-0.5 active:shadow-none"
        >
          <LogOut size={22} />

          {!isCollapsed && <span>ĐĂNG XUẤT</span>}
        </button>
      </div>
    </aside>
  );
}
