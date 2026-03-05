"use client";
import { useTodoStore } from "@/stores/useTodoStore";
import { format, addDays, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function WeeklyCalendar() {
  const {
    selectedDate,
    currentWeekStart,
    setSelectedDate,
    nextWeek,
    prevWeek,
  } = useTodoStore();

  const days = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i),
  );

  return (
    <div className="w-80 border-r border-gray-500 h-full p-6 bg-gray-50 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Tuần này</h2>
        <div className="flex gap-1 text-black">
          <button onClick={prevWeek} className="p-1 hover:bg-gray-200 rounded">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextWeek} className="p-1 hover:bg-gray-200 rounded">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {days.map((day) => {
          const active = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                active
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              <div className="text-left">
                <p
                  className={`text-xs uppercase font-black ${active ? "text-blue-100" : "text-gray-400"}`}
                >
                  {format(day, "EEEE")}
                </p>
                <p className="text-lg font-bold">{format(day, "dd/MM")}</p>
              </div>
              {active && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
