"use client";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { notifier } from "@/lib/notifier";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useFlashcardFolder() {
  const {
    data: folders,
    mutate,
    isLoading,
  } = useSWR("/api/flashcard/folder", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);

  const openEditModal = (folder: any) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFolder(null);
    setNewFolderName("");
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Xóa toàn bộ thư mục này chứ?")) return;
    try {
      await axios.delete(`/api/flashcard/folder?id=${id}`);
      mutate();
      notifier.warn("Đã xóa thư mục!");
    } catch (error) {
      notifier.error("Lỗi xóa thư mục");
    }
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      notifier.warn("Vui lòng nhập tên thư mục!");
      return;
    }

    const isDuplicate = folders?.some(
      (folder: any) =>
        // Kiểm tra tên giống nhau (không phân biệt chữ hoa/thường để an toàn hơn)
        folder.name.toLowerCase() === trimmedName.toLowerCase() &&
        // Nếu đang ở chế độ "Sửa", bỏ qua việc so sánh với chính nó
        folder.id !== editingFolder?.id,
    );

    if (isDuplicate) {
      notifier.warn("Tên folder đã tồn tại");
      return; // Dừng luôn, không gọi API nữa
    }

    setIsSubmitting(true);
    try {
      if (editingFolder) {
        await axios.patch("/api/flashcard/folder", {
          id: editingFolder.id,
          name: trimmedName,
        });
        notifier.success("Đã cập nhật thư mục!");
      } else {
        await axios.post("/api/flashcard/folder", { name: trimmedName });
        notifier.success("Tạo thư mục thành công!");
      }
      closeModal();
      mutate();
    } catch (error) {
      notifier.error("Lỗi lưu thư mục!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    folders,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    newFolderName,
    setNewFolderName,
    isSubmitting,
    handleSaveFolder,
    handleDeleteFolder,
    openEditModal,
    editingFolder,
    closeModal,
  };
}
