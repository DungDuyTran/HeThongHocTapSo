"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
// Đảm bảo import đúng biến 'correct' từ hook của bạn
import { useQuizLogic } from "../../hooks/useQuizLogic";
import { Clock, Trophy, ArrowLeft, Target } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FastQuizPage() {
  const { folderId } = useParams();
  const router = useRouter();
  const { data: quizData, isLoading } = useSWR(
    `/api/flashcard/quiz?folderId=${folderId}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  // 1. PHẢI lấy thêm biến 'correct' ở đây
  const { index, timer, isFinished, handleAnswer, current, correct } =
    useQuizLogic(folderId as string, quizData || []);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black italic text-green-600 animate-pulse uppercase tracking-widest">
        Đang soạn đề...
      </div>
    );

  if (isFinished)
    return (
      <ResultScreen
        // 2. Dùng 'correct' để tính điểm thực tế, không dùng 'index'
        score={Math.round((correct / quizData.length) * 100)}
        correctCount={correct}
        totalCount={quizData.length}
        folderId={folderId}
        router={router}
      />
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 flex flex-col items-center no-scrollbar">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="p-2 border-2 border-black rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <div className="bg-green-700 text-white px-4 py-1.5 rounded-full font-black flex items-center gap-2 text-xs italic border-2 border-black shadow-md">
              <Clock size={14} /> {timer}s
            </div>
            <div className="bg-white border-2 border-black px-4 py-1.5 rounded-full font-black text-xs shadow-sm uppercase italic">
              {index + 1} / {quizData.length}
            </div>
          </div>
        </header>

        {/* THẺ CÂU HỎI */}
        <div className="mb-10 p-12 bg-white border-4 border-black rounded-[40px] shadow-[15px_15px_0px_0px_#000] min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">
            <Target size={14} className="text-green-600" /> Question
          </div>
          <h2 className="text-3xl font-black text-center uppercase italic break-words w-full">
            {current?.front}
          </h2>
        </div>

        {/* 4 ĐÁP ÁN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current?.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="group flex items-center p-5 bg-white border-2 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] hover:bg-green-600 hover:text-white active:translate-y-1 active:shadow-none transition-all text-left"
            >
              <div className="w-8 h-8 flex-shrink-0 bg-green-600 text-white border-2 border-black rounded-lg flex items-center justify-center font-black mr-4 text-xs group-hover:bg-white group-hover:text-green-600 transition-colors">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-sm font-black tracking-tight uppercase italic flex-1">
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  score,
  correctCount,
  totalCount,
  folderId,
  router,
}: any) {
  return (
    <div className="flex items-center justify-center mt-12 bg-white">
      <div className="max-w-sm w-full border-4 border-black p-10 rounded-[40px] shadow-[15px_15px_0px_0px_#000] text-center bg-white">
        <Trophy size={60} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">
          Kết quả
        </h2>
        <div className="text-8xl font-black leading-none mb-4 text-green-600 italic">
          {score}%
        </div>
        <p className="font-bold mb-8 uppercase text-xs text-slate-500 italic">
          Bạn làm đúng {correctCount} / {totalCount} câu
        </p>
        <button
          onClick={() => router.push(`/users/flashcard/${folderId}`)}
          className="w-full py-4 bg-green-600 text-white font-black border-2 border-black rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase italic text-sm"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
