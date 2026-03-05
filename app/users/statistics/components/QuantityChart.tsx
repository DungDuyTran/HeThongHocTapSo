"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function QuantityChart({ data }: { data: any[] }) {
  return (
    <div className="h-full w-full flex flex-col p-4">
      <h3 className="text-xl font-bold mb-8 uppercase tracking-tight">
        Nhiệm vụ đã hoàn thành
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            <YAxis tick={{ fontWeight: 600, fill: "#000" }} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                border: "2px solid black",
                fontWeight: "bold",
              }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 6, fill: "#fff", stroke: "#2563eb", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
