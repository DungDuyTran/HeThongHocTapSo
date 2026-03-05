"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0,
    );
    return (
      <div className="bg-white p-4 border-2 border-black rounded-xl  font-bold">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RateChart({ data }: { data: any[] }) {
  return (
    <div className="h-full w-full flex flex-col p-4">
      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">
        Tỷ lệ hoàn thành nhiệm vụ
      </h3>
      <p className="text-[10px] font-bold text-slate-400 mb-8 italic uppercase">
        * Xanh: Đã xong | Đỏ: Chưa hoàn thành
      </p>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} stackOffset="expand">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="name"
              tick={{ fontWeight: 600, fill: "#000" }}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
              tick={{ fontWeight: 600, fill: "#000" }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" height={40} />
            {/* Hoàn thành ở dưới (Xanh) */}
            <Bar
              name="Đã xong"
              dataKey="completed"
              stackId="a"
              fill="#16a34a"
            />
            {/* Chưa xong ở trên (Đỏ) */}
            <Bar
              name="Chưa xong"
              dataKey="uncompleted"
              stackId="a"
              fill="#dc2626"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
