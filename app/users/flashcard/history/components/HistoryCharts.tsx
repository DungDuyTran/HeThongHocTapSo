"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function HistoryCharts({ viewMode, chartData }: any) {
  return (
    <main className="lg:w-3/4 p-6 border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] h-[380px] bg-white overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        {viewMode === "score" ? (
          <AreaChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "2px solid black",
                fontWeight: "900",
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#16a34a"
              strokeWidth={3}
              fill="#16a34a"
              fillOpacity={0.1}
            />
          </AreaChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900 }}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "12px",
                border: "2px solid black",
                fontWeight: "900",
              }}
            />
            <Bar
              dataKey="count"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
              stroke="black"
              strokeWidth={2}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </main>
  );
}
