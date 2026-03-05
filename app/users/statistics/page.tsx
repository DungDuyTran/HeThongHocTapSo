"use client";
import { useStatistics } from "./hooks/useStatistics";
import StatisticsFilter from "./components/StatisticsFilter";
import QuantityChart from "./components/QuantityChart";
import RateChart from "./components/RateChart";

export default function StatisticsPage() {
  const { period, setPeriod, view, setView, data, isLoading } = useStatistics();

  return (
    // Thu nhỏ giao diện để hiện thị được nhiều hơn
    <main className="h-screen w-full bg-white p-8 origin-top-left  overflow-hidden flex flex-col text-black ">
      <h1 className="text-5xl font-black mb-1 flex justify-center uppercase tracking-tight">
        Thống kê kết quả
      </h1>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* Page Button: Cố định bên trái */}
        <StatisticsFilter
          period={period}
          setPeriod={setPeriod}
          view={view}
          setView={setView}
        />

        {/* Page Biểu đồ: Hiển thị dựa trên view đã chọn */}
        <section className="flex-1 bg-white border-2 border-black p-8 ">
          {isLoading ? (
            <div className="h-full flex items-center justify-center font-bold text-slate-400">
              Đang tính toán dữ liệu...
            </div>
          ) : (
            <>
              {view === "quantity" ? (
                <QuantityChart data={data} />
              ) : (
                <RateChart data={data} />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
