"use client";
import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { Clock, CheckCircle2 } from "lucide-react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function FastQuizPage() {
  const { folderId } = useParams();
  const router = useRouter();

  // Gọi API Quiz đã trộn sẵn
  const { data: quizData, isLoading } = useSWR(
    `/api/flashcard/quiz?folderId=${folderId}`,
    fetcher,
    {
      revalidateOnFocus: false, // Tắt tự động load lại khi chuyển tab để tránh mất tiến trình
    },
  );

  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Bộ đếm thời gian
  React.useEffect(() => {
    if (isLoading || isFinished) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isLoading, isFinished]);

  const handleAnswer = async (selected: string) => {
    const isCorrect = selected === quizData[index].back;
    const newCorrect = isCorrect ? correct + 1 : correct;
    setCorrect(newCorrect);

    if (index + 1 < quizData.length) {
      setIndex(index + 1);
    } else {
      setIsFinished(true);
      await axios.post("/api/flashcard/history", {
        folderId: parseInt(folderId as string),
        correct: newCorrect,
        total: quizData.length,
        time: timer,
      });
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black animate-pulse uppercase">
        Đang bốc thẻ...
      </div>
    );

  if (isFinished) {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-10 text-black scale-[0.85]">
        <div className="max-w-xl w-full border-[6px] border-black p-12 rounded-[50px] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-5xl font-black mb-6 uppercase italic border-b-4 border-black pb-4">
            Xong!
          </h2>
          <div className="text-[120px] font-black leading-none mb-4">
            {Math.round((correct / quizData.length) * 100)}%
          </div>
          <button
            onClick={() => router.push(`/users/flashcard/${folderId}`)}
            className="w-full py-5 bg-green-600 text-white font-black rounded-2xl border-[4px] border-black text-xl uppercase italic"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    );
  }

  const current = quizData[index];

  return (
    <div className="min-h-screen bg-white text-black p-10 flex flex-col items-center scale-[0.85] origin-top">
      <div className="w-full max-w-5xl">
        <header className="flex justify-between items-center mb-10 border-b-[4px] border-black pb-6">
          <div className="bg-black text-white px-5 py-2 rounded-xl font-black flex items-center gap-2">
            <Clock size={20} /> {timer}s
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">
            Quiz
          </h1>
          <div className="text-xl font-black uppercase">
            Tiến trình: <span className="text-blue-600">{index + 1}</span> /{" "}
            {quizData.length}
          </div>
        </header>

        <div className="mb-12 p-12 bg-white border-[6px] border-black rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] min-h-[250px] flex items-center justify-center">
          <h2 className="text-4xl font-black leading-tight text-center uppercase italic">
            {current?.front}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {current?.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="group flex items-center p-6 bg-green-600 text-white border-[4px] border-black rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all text-left"
            >
              <div className="w-12 h-12 flex-shrink-0 border-[3px] border-white rounded-full flex items-center justify-center font-black mr-6 text-xl">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-2xl font-bold tracking-tight">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
