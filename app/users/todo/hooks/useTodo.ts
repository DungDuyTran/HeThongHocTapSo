"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import { format } from "date-fns";
import { useTodoStore } from "@/stores/useTodoStore";
import { notifier } from "@/lib/notifier"; // Nhớ import notifier nhé

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const priorityWeight: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function useTodo() {
  const { selectedDate } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const {
    data: todos,
    mutate,
    isLoading,
  } = useSWR(`/api/todo?date=${dateStr}`, fetcher);

  const sortedTodos = useMemo(() => {
    if (!todos) return [];

    return [...todos].sort((a, b) => {
      // 1. So sánh trạng thái hoàn thành (Chưa làm lên trên, đã làm xuống dưới)
      if (a.status !== b.status) {
        return a.status === false ? -1 : 1;
      }

      // 2. Nếu cùng trạng thái, so sánh mức độ ưu tiên
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;

      // Sắp xếp giảm dần (Điểm cao nằm trên)
      return weightB - weightA;
    });
  }, [todos]);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      mutate(
        todos.map((t: any) =>
          t.id === id ? { ...t, status: !currentStatus } : t,
        ),
        false,
      );

      await axios.patch(`/api/todo/${id}`, { status: !currentStatus });
      mutate();

      // Hiện thông báo khi check hoàn thành (tùy chọn)
      if (!currentStatus) {
        notifier.success("Tuyệt vời!", "Đã hoàn thành nhiệm vụ.");
      }
    } catch (error) {
      notifier.error("Lỗi!", "Cập nhật trạng thái thất bại.");
    }
  };

  const handleSaveTodo = async (formData: any) => {
    // Check rỗng với 1 tham số như Dũng nhắc nhở
    if (!formData.title?.trim()) {
      notifier.warn("Tên nhiệm vụ không được để trống!");
      return;
    }

    try {
      if (formData.id) {
        await axios.patch(`/api/todo/${formData.id}`, formData);
        notifier.success("Thành công!", "Đã cập nhật nhiệm vụ.");
      } else {
        await axios.post("/api/todo", {
          ...formData,
          targetDate: selectedDate,
        });
        notifier.success("Thành công!", "Đã tạo nhiệm vụ mới.");
      }
      setIsModalOpen(false);
      setEditingTodo(null);
      mutate();
    } catch (err) {
      notifier.error("Thất bại!", "Lỗi lưu nhiệm vụ!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận xóa?")) {
      try {
        await axios.delete(`/api/todo/${id}`);
        // Hàm warn chỉ truyền 1 tham số
        notifier.warn("Đã xóa nhiệm vụ!");
        mutate();
      } catch (error) {
        notifier.error("Lỗi!", "Không thể xóa nhiệm vụ lúc này.");
      }
    }
  };

  return {
    todos: sortedTodos,
    selectedDate,
    isModalOpen,
    setIsModalOpen,
    editingTodo,
    setEditingTodo,
    handleToggle,
    handleSaveTodo,
    handleDelete,
    isLoading,
  };
}
