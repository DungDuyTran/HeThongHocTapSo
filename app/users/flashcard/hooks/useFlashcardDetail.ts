"use client";
import { useState, useMemo } from "react";
import axios from "axios";
import { notifier } from "@/lib/notifier"; // Thêm notifier

export function useFlashcardDetail(cards: any[], mutate: any) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ front: "", back: "" });
  const [editingCard, setEditingCard] = useState<any>(null);

  const starredCards = useMemo(
    () => cards?.filter((c: any) => c.isStarred) || [],
    [cards],
  );
  const currentCard = cards?.[index];

  const toggleStar = async (cardId: number, currentState: boolean) => {
    await axios.patch("/api/flashcard/card/star", {
      id: cardId,
      isStarred: currentState,
    });
    if (!currentState) notifier.success("Đã thêm vào mục quan trọng! ⭐");
    mutate();
  };

  const deleteCard = async (id: number) => {
    if (confirm("Xác nhận xóa thẻ này?")) {
      await axios.delete(`/api/flashcard/card?id=${id}`);
      notifier.warn("Đã xóa thẻ!");
      mutate();
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard.front.trim() || !editingCard.back.trim()) {
      notifier.warn("Nhập đủ 2 mặt nhé!");
      return;
    }
    await axios.patch("/api/flashcard/card", editingCard);
    setEditingCard(null);
    notifier.success("Đã cập nhật thẻ!");
    mutate();
  };

  const handleCreateCard = async (folderId: number) => {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      notifier.warn("Nhập đủ 2 mặt của thẻ!");
      return;
    }
    await axios.post("/api/flashcard/card", { ...newCard, folderId });
    setNewCard({ front: "", back: "" });
    notifier.success("Thành công!", "Đã tạo thẻ Flashcard mới.");
    mutate();
  };

  return {
    index,
    setIndex,
    flipped,
    setFlipped,
    newCard,
    setNewCard,
    starredCards,
    currentCard,
    toggleStar,
    deleteCard,
    editingCard,
    setEditingCard,
    handleUpdateCard,
    handleCreateCard,
  };
}
