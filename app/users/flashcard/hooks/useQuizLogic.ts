"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { notifier } from "@/lib/notifier";

export function useQuizLogic(folderId: string, quizData: any[]) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  // 1. CẢNH BÁO KHI TẮT TAB HOẶC F5
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinished && Array.isArray(quizData) && quizData.length >= 4) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFinished, quizData]);

  // 2. CHẠY BỘ ĐẾM GIỜ
  useEffect(() => {
    if (!Array.isArray(quizData) || isFinished || quizData.length < 4) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [quizData, isFinished]);

  const handleAnswer = async (selected: string) => {
    if (
      isProcessing ||
      isFinished ||
      !Array.isArray(quizData) ||
      quizData.length < 4
    )
      return;
    setIsProcessing(true);

    const correctAnswer = quizData[index].back.trim();
    const userAnswer = selected.trim();
    const isCorrect = userAnswer === correctAnswer;
    const newCorrect = isCorrect ? correct + 1 : correct;

    setCorrect(newCorrect);

    const answerDetail = {
      front: quizData[index].front,
      options: quizData[index].options,
      correctAnswer: correctAnswer,
      userChoice: userAnswer,
      isCorrect: isCorrect,
    };

    const newAnswersHistory = [...userAnswers, answerDetail];
    setUserAnswers(newAnswersHistory);

    if (index + 1 < quizData.length) {
      setTimeout(() => {
        setIndex(index + 1);
        setIsProcessing(false);
      }, 250);
    } else {
      setIsFinished(true);
      const finalScore = Math.round((newCorrect / quizData.length) * 100);
      try {
        await axios.post("/api/flashcard/history", {
          folderId: parseInt(folderId),
          correctAnswers: newCorrect,
          totalQuestions: quizData.length,
          timeSpent: timer,
          score: finalScore,
          details: newAnswersHistory,
        });
        notifier.success("Hoàn thành!", "Đã lưu kết quả bài kiểm tra.");
      } catch (err) {
        notifier.error("Lỗi!", "Không thể lưu lịch sử bài thi.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return {
    index,
    correct,
    timer,
    isFinished,
    handleAnswer,
    // Tránh lỗi undefined khi mảng trống bằng check Array.isArray
    current:
      Array.isArray(quizData) && quizData.length >= 4 ? quizData[index] : null,
    userAnswers,
    progress:
      Array.isArray(quizData) && quizData.length > 0
        ? ((index + 1) / quizData.length) * 100
        : 0,
  };
}
