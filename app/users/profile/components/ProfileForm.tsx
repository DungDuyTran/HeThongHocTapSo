import {
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  Save,
  Loader2,
} from "lucide-react";

export function ProfileForm({
  formData,
  setFormData,
  isSaving,
  handleUpdate,
  age,
  lastUpdate,
}: any) {
  return (
    <form
      onSubmit={handleUpdate}
      className="lg:col-span-7 h-full bg-white border-4 border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] p-6 flex flex-col overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 h-0 flex-grow overflow-y-auto pr-1 no-scrollbar">
        {/* Họ Tên - Rõ nét */}
        <div className="space-y-1.5 p-3 border-2 border-black rounded-xl bg-green-50 shadow-[3px_3px_0px_0px_#000]">
          <label className="text-[10px] font-black uppercase italic flex items-center gap-1.5 text-green-700">
            <User size={13} strokeWidth={2.5} /> Họ và tên đầy đủ
          </label>
          <input
            type="text"
            value={formData.hoTen}
            onChange={(e) =>
              setFormData({ ...formData, hoTen: e.target.value })
            }
            className="w-full p-2.5 border-2 border-black rounded-xl bg-white font-bold italic shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none"
            required
          />
        </div>

        {/* Chức danh - Đã bỏ opacity, hiện vòng tròn cấm khi hover */}
        <div className="space-y-1.5 p-3 border-2 border-black rounded-xl bg-blue-50 shadow-[3px_3px_0px_0px_#000]">
          <label className="text-[10px] font-black uppercase italic flex items-center gap-1.5 text-blue-700">
            <Shield size={13} strokeWidth={2.5} /> Chức danh
          </label>
          <input
            disabled
            value="SINH VIÊN @ DTU"
            className="w-full p-2.5 border-2 border-slate-300 text-slate-500 bg-slate-100 rounded-xl font-bold italic cursor-not-allowed shadow-[1.5px_1.5px_0px_0px_#000]"
          />
        </div>

        {/* Email - Đã bỏ opacity, hiện vòng tròn cấm khi hover */}
        <div className="space-y-1.5 p-3 border-2 border-black rounded-xl bg-slate-50 shadow-[3px_3px_0px_0px_#000]">
          <label className="text-[10px] font-black uppercase italic flex items-center gap-1.5 text-slate-600">
            <Mail size={13} strokeWidth={2.5} /> Email (Không thể thay đổi)
          </label>
          <input
            disabled
            type="email"
            value={formData.email}
            className="w-full p-2.5 border-2 border-slate-300 text-slate-500 bg-slate-100 rounded-xl font-bold italic cursor-not-allowed shadow-[1.5px_1.5px_0px_0px_#000]"
          />
        </div>

        {/* SĐT - 10 SỐ */}
        <div className="space-y-1.5 p-3 border-2 border-black rounded-xl bg-orange-50 shadow-[3px_3px_0px_0px_#000]">
          <label className="text-[10px] font-black uppercase italic flex items-center gap-1.5 text-orange-700">
            <Phone size={13} strokeWidth={2.5} /> Số điện thoại (10 số)
          </label>
          <input
            type="text"
            value={formData.sdt}
            onChange={(e) =>
              setFormData({
                ...formData,
                sdt: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
            className="w-full p-2.5 border-2 border-black rounded-xl bg-white font-bold italic shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none"
            placeholder="09xxxxxxxx"
            required
          />
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1.5 md:col-span-2 p-3 border-2 border-black rounded-xl bg-purple-50 shadow-[3px_3px_0px_0px_#000]">
          <label className="text-[10px] font-black uppercase italic flex items-center gap-1.5 text-purple-700">
            <Calendar size={13} strokeWidth={2.5} /> Ngày sinh (
            {age !== "---" ? `${age} tuổi` : "Chưa cập nhật"})
          </label>
          <input
            type="date"
            value={formData.ngaySinh}
            onChange={(e) =>
              setFormData({ ...formData, ngaySinh: e.target.value })
            }
            className="w-full p-2.5 border-2 border-black rounded-xl bg-white font-bold italic shadow-[1.5px_1.5px_0px_0px_#000] focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4 flex flex-row justify-between items-center gap-4 mt-auto flex-shrink-0">
        <div className="text-[8px] font-black uppercase italic text-slate-400 italic">
          Dữ liệu cuối: {lastUpdate}
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-green-600 text-white font-black uppercase italic border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} strokeWidth={2.5} />
          )}
          <span>Lưu hồ sơ</span>
        </button>
      </div>
    </form>
  );
}
