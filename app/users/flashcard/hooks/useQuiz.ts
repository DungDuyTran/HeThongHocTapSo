"use client";
import { useState, useEffect } from "react";

export function useQuiz(cards: any[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffled, setShuffled] = useState<any[]>([]);

  useEffect(() => {
    if (cards.length > 0)
      setShuffled([...cards].sort(() => Math.random() - 0.5));
  }, [cards]);

  useEffect(() => {
    let interval: any;
    if (!isFinished) interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const nextQuestion = (isCorrect: boolean) => {
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (currentIndex + 1 < shuffled.length) setCurrentIndex((i) => i + 1);
    else setIsFinished(true);
  };

  return {
    currentCard: shuffled[currentIndex],
    currentIndex,
    total: shuffled.length,
    correctCount,
    timer,
    isFinished,
    nextQuestion,
  };
}
