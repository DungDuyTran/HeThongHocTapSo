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
  });

  // 1. Khôi phục dữ liệu từ LocalStorage khi khởi tạo . 
  useEffect(() => {
    const stored = localStorage.getItem("dtu_events_final");
    const storedCate = localStorage.getItem("dtu_cats_final");
    if (stored) setEvents(JSON.parse(stored));
    if (storedCate) setCategories(JSON.parse(storedCate));
  }, []);

  // 2. Hàm đồng bộ dữ liệu (Sync) giúp code DRY 
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
