import { Camera } from "lucide-react";

export function ProfileCard({ user, hoTenDisplay }: any) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(hoTenDisplay)}&background=fff&color=16a34a&bold=true&size=256&border=true`;

  return (
    <div className="lg:col-span-5 h-full">
      <div className="bg-white border-4 border-black h-full rounded-[32px] shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col relative">
        <div className="bg-green-600 h-20 border-b-4 border-black flex items-center justify-center relative flex-shrink-0">
          <div className="mt-2 absolute top-1 right-3 text-white/30 font-black italic text-3xl select-none tracking-tighter">
            Cố lên nhé!
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1.5px 1.5px, black 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          ></div>
        </div>

        <div className="px-6 flex flex-col items-center justify-center -mt-10 relative z-10 h-0 flex-grow">
          <div className="relative group">
            <img
              src={avatarUrl}
              className="w-40 h-40 rounded-3xl border-4 border-black bg-white shadow-[10px_10px_0px_0px_#000] object-cover transition-all"
              alt="Avatar"
            />
            <button
              type="button"
              className="absolute bottom-2 right-2 p-2.5 bg-yellow-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 transition-all"
            >
              <Camera size={16} strokeWidth={3} />
            </button>
          </div>
          <h2 className="mt-6 text-2xl font-black uppercase italic text-center leading-tight text-black truncate w-full px-4">
            {hoTenDisplay}
          </h2>
          <div className="mt-3 flex gap-2">
            <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase italic rounded-full shadow-[2px_2px_0px_0px_#16a34a]">
              ID: {user?.id || "N/A"}
            </span>
            <span className="px-3 py-1 bg-green-200 text-black text-[9px] font-black uppercase italic rounded-full shadow-[2px_2px_0px_0px_#000]">
              ROLE: {user?.vaiTro}
            </span>
          </div>
        </div>

        <div className="border-t-4 border-black h-10 bg-slate-50 flex items-center justify-center flex-shrink-0">
          <p className="text-[10px] font-black italic text-slate-300 uppercase">
            DTU Personalize system v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
