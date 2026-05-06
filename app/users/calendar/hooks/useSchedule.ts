"use client";
import { useState, useEffect, useCallback } from "react";

interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  note?: string;
  categoryId: string;
  backgroundColor: string;
}

export function useSchedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [categories, setCategories] = useState([
    { id: "1", name: "Học tập", color: "#16a34a" },
    { id: "2", name: "Làm việc", color: "#2563eb" },
    { id: "3", name: "Thể thao", color: "#f59e0b" },
  ]);

  const [popups, setPopups] = useState({
    add: false,
    edit: false,
    cate: false,
  });

  const [form, setForm] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    note: "",
    categoryId: "1",
    days: [] as number[], // Lưu danh sách các thứ lặp lại (0: CN, 1: T2...)
  });

  const loadData = useCallback(() => {
    const stored = localStorage.getItem("dtu_events_final");
    const storedCate = localStorage.getItem("dtu_cats_final");
    if (stored) setEvents(JSON.parse(stored));
    if (storedCate) setCategories(JSON.parse(storedCate));
  }, []);

  // Khôi phục dữ liệu từ LocalStorage
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleSyncFromAI = (e: any) => {
      // Khi Chatbot phát ra event "storage", hàm này sẽ chạy để cập nhật lại UI
      loadData();
    };

    window.addEventListener("storage", handleSyncFromAI);
    return () => window.removeEventListener("storage", handleSyncFromAI);
  }, [loadData]);

  const sync = useCallback((newEvs: ScheduleEvent[], newCats?: any[]) => {
    setEvents(newEvs);
    localStorage.setItem("dtu_events_final", JSON.stringify(newEvs));
    if (newCats) {
      setCategories(newCats);
      localStorage.setItem("dtu_cats_final", JSON.stringify(newCats));
    }
  }, []);

  return { events, categories, popups, setPopups, form, setForm, sync };
}
