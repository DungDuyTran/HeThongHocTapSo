"use client";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

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

  // Trạng thái quản lý việc đang sửa thư mục nào
  const [editingFolder, setEditingFolder] = useState<any>(null);

  // Mở Modal để sửa
  const openEditModal = (folder: any) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsModalOpen(true);
  };

  // Đóng và reset modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFolder(null);
    setNewFolderName("");
  };

  // Logic Xóa thư mục
  const handleDeleteFolder = async (id: number) => {
    if (!confirm("bạn chắc chắn muốn xóa toàn bộ thư mục này chứ?")) return;
    try {
      await axios.delete(`/api/flashcard/folder?id=${id}`);
      mutate(); // Cập nhật UI ngay lập tức
    } catch (error) {
      console.error("Lỗi xóa thư mục:", error);
    }
  };

  // Logic Lưu (Tạo mới hoặc Cập nhật)
  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingFolder) {
        // Cập nhật tên thư mục
        await axios.patch("/api/flashcard/folder", {
          id: editingFolder.id,
          name: newFolderName,
        });
      } else {
        await axios.post("/api/flashcard/folder", { name: newFolderName });
      }
      closeModal();
      mutate();
    } catch (error) {
      console.error("Lỗi lưu thư mục:", error);
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
