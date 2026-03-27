"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export function useQuizLogic(folderId: string, quizData: any[]) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Chống click loạn xạ

  // 1. Bộ đếm thời gian
  useEffect(() => {
    if (!quizData || isFinished || quizData.length === 0) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [quizData, isFinished]);

  // 2. Hàm xử lý đáp án (Đã thêm Log Debug)
  const handleAnswer = async (selected: string) => {
    if (isProcessing || isFinished) return;
    setIsProcessing(true);

    // Lấy đáp án chuẩn từ DB và làm sạch khoảng trắng
    const correctAnswer = quizData[index].back.trim();
    const userAnswer = selected.trim();

    // Dòng LOG quan trọng để Dũng soi lỗi ở F12
    console.log(
      `--- Câu ${index + 1}/${quizData.length} --- \n` +
        `Bạn chọn: [${userAnswer}] \n` +
        `Đáp án đúng: [${correctAnswer}] \n` +
        `Kết quả so sánh: ${userAnswer === correctAnswer}`,
    );

    const isCorrect = userAnswer === correctAnswer;
    const newCorrect = isCorrect ? correct + 1 : correct;

    setCorrect(newCorrect);

    // Chuyển câu hoặc kết thúc
    if (index + 1 < quizData.length) {
      setTimeout(() => {
        setIndex(index + 1);
        setIsProcessing(false);
      }, 200); // Delay nhẹ để user kịp thấy phản hồi
    } else {
      setIsFinished(true);
      const finalScore = Math.round((newCorrect / quizData.length) * 100);

      try {
        // Gửi kết quả về MySQL Aiven
        await axios.post("/api/flashcard/history", {
          folderId: parseInt(folderId),
          correctAnswers: newCorrect,
          totalQuestions: quizData.length,
          timeSpent: timer,
          score: finalScore,
        });
        console.log("✅ Đã lưu lịch sử học tập thành công!");
      } catch (err) {
        console.error("❌ Lỗi khi lưu lịch sử:", err);
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
    current: quizData?.[index],
    // Trả về thêm progress để làm thanh thanh trạng thái cho đẹp
    progress: quizData?.length > 0 ? ((index + 1) / quizData.length) * 100 : 0,
  };
}
