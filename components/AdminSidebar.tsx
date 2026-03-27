"use client";

import { Users, Activity, BarChart3, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import axios from "axios"; 

const adminMenuItems = [
  { title: "Tổng quan", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
  { title: "Quản lý tài khoản", icon: <Users size={20} />, path: "/admin/users" },
  { title: "Theo dõi hoạt động", icon: <Activity size={20} />, path: "/admin/activities" },
  { title: "Thống kê & Báo cáo", icon: <BarChart3 size={20} />, path: "/admin/reports" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname(); 

  const handleLogout = async () => {
    if(!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;
    try {
      await axios.post("/api/auth/logout");
      router.push("/");
      router.refresh();
    } catch (error) {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div className="text-xl font-black text-yellow-500 tracking-tighter px-2">
          ADMIN PANEL
        </div>
        <button 
          onClick={handleLogout}
          title="Đăng xuất"
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90 group"
        >
          <LogOut size={22} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <nav className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        <ul className="space-y-2">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800 text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold">
        footer
      </div>
    </div>
  );
}