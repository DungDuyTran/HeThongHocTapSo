"use client";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import axios from "axios";
import { notifier } from "@/lib/notifier"; // Import notifier

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export interface Category {
  id: string;
  name: string;
  color: string;
}

export function useNote() {
  const { data: notes, mutate, isLoading } = useSWR("/api/note", fetcher);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("dtu_note_cats");
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      const defaultCats = [
        { id: "1", name: "HỌC TẬP", color: "#bfdbfe" },
        { id: "2", name: "CÔNG VIỆC", color: "#fde047" },
        { id: "3", name: "CÁ NHÂN", color: "#bbf7d0" },
      ];
      setCategories(defaultCats);
      localStorage.setItem("dtu_note_cats", JSON.stringify(defaultCats));
    }
  }, []);

  const syncCategories = useCallback((newCats: Category[]) => {
    setCategories(newCats);
    localStorage.setItem("dtu_note_cats", JSON.stringify(newCats));
  }, []);

  // 1. Hành động Ghim
  const togglePin = async (id: number, currentPin: boolean) => {
    if (!notes) return;
    try {
      mutate(
        notes.map((n: any) =>
          n.id === id ? { ...n, isPinned: !currentPin } : n,
        ),
        false,
      );
      await axios.put(`/api/note/${id}`, { isPinned: !currentPin });
      mutate();

      if (!currentPin) {
        notifier.success("Đã ghim!", "Ghi chú sẽ luôn nằm ở đầu danh sách.");
      } else {
        notifier.info("Bỏ ghim", "Ghi chú đã trở về vị trí cũ.");
      }
    } catch (error) {
      notifier.error("Lỗi!", "Không thể thực hiện thao tác ghim.");
    }
  };

  // 2. Hành động Xóa
  const deleteNote = async (id: number) => {
    if (confirm("Chắc chắn muốn xóa ghi chú này?")) {
      try {
        await axios.delete(`/api/note/${id}`);
        mutate();
        notifier.warn("Đã tiễn một ghi chú lên đường! ");
      } catch (error) {
        notifier.error("Thất bại", "Không thể xóa ghi chú này.");
      }
    }
  };

  // 3. Hành động Lưu
  const saveNote = async (formData: any) => {
    try {
      if (formData.id) {
        await axios.put(`/api/note/${formData.id}`, formData);
        notifier.success("Đã cập nhật!", "Nội dung ghi chú đã được thay đổi.");
      } else {
        await axios.post("/api/note", formData);
        notifier.success("Thành công!", "Ghi chú mới đã được lưu vào kho.");
      }
      mutate();
    } catch (err) {
      notifier.error("Lỗi hệ thống", "Không thể lưu ghi chú vào lúc này.");
    }
  };

  return {
    notes: notes || [],
    isLoading,
    categories,
    syncCategories,
    togglePin,
    deleteNote,
    saveNote,
  };
}
