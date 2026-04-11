"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  Mail, Search, ChevronLeft, ChevronRight, 
  RotateCcw, Filter, Lock, Unlock, Loader2, 
  User, ShieldCheck, UserCog
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); 
  
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/users?t=${new Date().getTime()}`);
      setUsers(res.data);
    } catch (err) { 
      console.error("Lỗi lấy danh sách:", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  const handleToggleLock = async (id: number, email: string, currentSdt: string | null) => {
    const isCurrentlyLocked = currentSdt === "LOCKED";
    const actionText = isCurrentlyLocked ? "MỞ KHÓA" : "KHÓA";

    if (confirm(`Bạn có chắc muốn ${actionText} tài khoản: ${email}?`)) {
      setProcessingId(id);
      try {
        await axios.post(`/api/admin/users/${id}/toggle-lock`, { 
            isLocked: isCurrentlyLocked 
        });
        setUsers((prevUsers) => 
          prevUsers.map((u) => 
            u.id === id ? { ...u, sdt: isCurrentlyLocked ? null : "LOCKED" } : u
          )
        );
        alert(`Đã ${actionText} thành công!`);
        await fetchUsers();
      } catch (err) {
        alert("Lỗi xử lý yêu cầu!");
      } finally {
        setProcessingId(null); 
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    if (confirm("Gửi mật khẩu ngẫu nhiên về Email người dùng?")) {
      try {
        await axios.post(`/api/admin/users/${id}/reset-password`);
        alert("Đã gửi thành công!");
        setSelectedUser(null);
      } catch (err) { alert("Lỗi gửi mail!"); }
    }
  };

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = (u.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || u.vaiTro === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="space-y-8 min-h-screen pb-20 px-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">
          Quản lý người dùng
        </h1>
        <div className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-xs tracking-widest">
          Tổng: {filteredUsers.length} tài khoản
        </div>
      </div>

      {/* THANH CÔNG CỤ (Giống trang hoạt động) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative col-span-1 md:col-span-3">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email học viên..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl outline-none focus:bg-slate-50 transition-all font-medium"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-slate-400" size={18} />
          <select title="Chọn"
            value={roleFilter}
            onChange={(e) => {setRoleFilter(e.target.value); setCurrentPage(1);}}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl bg-white outline-none font-bold appearance-none cursor-pointer"
          >
            <option value="All">Tất cả vai trò</option>
            <option value="HocVien">Học Viên</option>
            <option value="Admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      {/* DANH SÁCH TÀI KHOẢN (Style Card rực rỡ) */}
      <div className="bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
            <p className="font-black uppercase text-xs tracking-widest text-slate-400">Đang đồng bộ dữ liệu ...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-24 font-bold text-slate-400 italic">Không tìm thấy tài khoản nào khớp yêu cầu.</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUsers.map((user: any) => {
                const isLocked = user.sdt === "LOCKED";
                return (
                  <div key={user.id} className={`group relative bg-white p-5 rounded-2xl border-2 transition-all duration-200 ${isLocked ? 'border-red-200 opacity-75' : 'border-slate-100 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-xl border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isLocked ? 'bg-slate-200' : 'bg-yellow-400 text-black'}`}>
                          {user.hoTen?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className={`font-black text-lg tracking-tight ${isLocked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {user.hoTen}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border-2 ${user.vaiTro === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                        {user.vaiTro}
                      </span>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-dotted border-slate-100 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border-2 ${isLocked ? 'bg-red-500 text-white border-black' : 'bg-green-400 text-black border-black'}`}>
                        {isLocked ? 'Đã bị khóa' : 'Hoạt động'}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)} 
                          className="p-2 bg-white border-2 border-black rounded-xl hover:bg-orange-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                          title="Cấp lại mật khẩu"
                        >
                          <RotateCcw size={18} />
                        </button>
                        
                        <button 
                          disabled={processingId === user.id}
                          onClick={() => handleToggleLock(user.id, user.email, user.sdt)} 
                          className={`p-2 border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${isLocked ? 'bg-green-400' : 'bg-red-500 text-white'}`}
                          title={isLocked ? "Mở khóa" : "Khóa tài khoản"}
                        >
                          {processingId === user.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : isLocked ? (
                            <Unlock size={18} />
                          ) : (
                            <Lock size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PHÂN TRANG (Giống hệt trang hoạt động) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 pt-10 border-t-2 border-slate-100 mt-6">
                <button title="Trang trước"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 border-2 border-black rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                   <span className="font-black text-sm uppercase italic">Trang</span>
                   <span className="bg-black text-white px-3 py-1 rounded-lg font-black text-sm">{currentPage}</span>
                   <span className="font-black text-sm">/ {totalPages}</span>
                </div>

                <button title="Trang sau"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 border-2 border-black rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL RESET PASS (Style mới) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white border-[4px] border-black rounded-[40px] p-10 w-full max-w-sm shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-400 border-[3px] border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <RotateCcw size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Cấp lại mật khẩu</h3>
              <p className="text-slate-500 mt-4 font-medium px-4">
                Xác nhận reset mật khẩu cho tài khoản:
              </p>
              <p className="font-black text-blue-600 mt-2 text-lg break-all">{selectedUser.email}</p>
              
              <div className="w-full mt-10 space-y-4">
                <button 
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="w-full py-4 rounded-2xl bg-black text-white font-black hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(255,165,0,1)] active:translate-y-1 active:shadow-none uppercase tracking-tighter"
                >
                  Xác nhận & Gửi Email
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-4 rounded-2xl bg-white border-2 border-black text-slate-600 font-black hover:bg-slate-50 transition-all uppercase text-xs"
                >
                  Hủy bỏ ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}