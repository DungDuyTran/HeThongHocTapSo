"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Mail, ShieldCheck, Search, ChevronLeft, ChevronRight, RotateCcw, Filter, Lock, Unlock, Loader2 } from "lucide-react";

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
            u.id === id 
              ? { ...u, sdt: isCurrentlyLocked ? null : "LOCKED" } 
              : u
          )
        );
        
        alert(`Đã ${actionText} thành công!`);
      
        await fetchUsers();
      } catch (err) {
        console.error(err);
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

  if (loading) return <div className="p-8 italic text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin"/> Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6 min-h-[80vh]"> 
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 italic">Quản lý tài khoản</h1>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold border border-blue-100">
          Tổng: {filteredUsers.length} người dùng
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full text-slate-900 shadow-sm rounded-xl">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative w-full md:w-48 text-slate-900 shadow-sm rounded-xl">
          <Filter className="absolute left-3 top-3 text-slate-400" size={18} />
          <select title="Lọc theo vai trò"
            value={roleFilter}
            onChange={(e) => {setRoleFilter(e.target.value); setCurrentPage(1);}}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
          >
            <option value="All">Tất cả vai trò</option>
            <option value="HocVien">Học Viên</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase">Người dùng</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase">Email</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase text-center">Trạng thái</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentUsers.map((user: any) => {
              const isLocked = user.sdt === "LOCKED";
              return (
                <tr key={user.id} className={`transition-all duration-300 ${isLocked ? 'bg-red-50/50' : 'hover:bg-slate-50/80'}`}>
                  <td className="p-4 text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white uppercase shadow-sm transition-colors ${isLocked ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                        {user.hoTen?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold transition-all ${isLocked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{user.hoTen}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.vaiTro}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                     <div className="flex items-center gap-2"><Mail size={14} className="opacity-60"/>{user.email}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${isLocked ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 text-green-600 border-green-200'}`}>
                      {isLocked ? 'Bị Khóa' : 'Hoạt Động'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setSelectedUser(user)} className="p-2 hover:bg-orange-100 text-orange-500 rounded-lg transition-colors" title="Reset Mật khẩu">
                        <RotateCcw size={18} />
                      </button>
                      
                      <button 
                        disabled={processingId === user.id}
                        onClick={() => handleToggleLock(user.id, user.email, user.sdt)} 
                        className={`p-2 rounded-lg transition-all ${isLocked ? 'hover:bg-green-100 text-green-600' : 'hover:bg-red-100 text-red-500'}`} 
                        title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                      >
                        {processingId === user.id ? (
                          <Loader2 size={18} className="animate-spin text-slate-400" />
                        ) : isLocked ? (
                          <Unlock size={18} />
                        ) : (
                          <Lock size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500 italic">Hiển thị {currentUsers.length} / {filteredUsers.length} người dùng</p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Trang {currentPage} / {totalPages || 1}</span>
            <div className="flex gap-1">
              <button title="Trang trước" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"><ChevronLeft size={18}/></button>
              <button title="Trang sau" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>
      </div>

      {/*reset mk */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <RotateCcw size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Cấp lại mật khẩu</h3>
              <p className="text-slate-500 mt-2">Xác nhận reset mật khẩu cho tài khoản:</p>
              <p className="font-bold text-blue-600 mt-1">{selectedUser.email}</p>
              
              <div className="w-full mt-8 space-y-3">
                <button 
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95"
                >
                  Xác nhận & Gửi Email
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}