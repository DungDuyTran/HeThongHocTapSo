"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useQuizLogic } from "../../hooks/useQuizLogic";
import {
  Clock,
  Trophy,
  ArrowLeft,
  Target,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FastQuizPage() {
  const { folderId } = useParams();
  const router = useRouter();

  const { data: quizData, isLoading } = useSWR(
    `/api/flashcard/quiz?folderId=${folderId}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const {
    index,
    timer,
    isFinished,
    handleAnswer,
    current,
    correct,
    userAnswers,
  } = useQuizLogic(folderId as string, quizData || []);

  const handleBack = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn quay lại? Tiến độ bài làm sẽ bị mất.",
      )
    ) {
      router.back();
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black italic text-green-600 animate-pulse uppercase bg-white">
        Đang soạn đề...
      </div>
    );

  // CHẶN TRIỆT ĐỂ: Nếu không phải mảng hoặc ít hơn 4 thẻ 
  if (!Array.isArray(quizData) || quizData.length < 4) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-sm w-full border-4 border-black p-10 rounded-[40px] shadow-[15px_15px_0px_0px_#000] text-center">
          <AlertCircle size={60} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-4 uppercase">Thông báo</h2>
          <p className="font-bold mb-8 text-slate-600 italic">
            Thư mục này hiện có {quizData?.length || 0} thẻ. Bạn cần tối thiểu 4
            thẻ để bắt đầu bài thi trắc nghiệm!
          </p>
          <button
            onClick={() => router.back()}
            className="w-full py-4 bg-black text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_#ef4444] hover:translate-y-1 transition-all uppercase text-sm"
          >
            Quay lại thêm thẻ
          </button>
        </div>
      </div>
    );
  }

  if (isFinished)
    return (
      <ResultScreen
        score={Math.round((correct / quizData.length) * 100)}
        correctCount={correct}
        totalCount={quizData.length}
        folderId={folderId}
        router={router}
        userAnswers={userAnswers}
      />
    );

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center no-scrollbar">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={handleBack}
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

        <div className="mb-10 p-12 bg-white border-4 border-black rounded-[40px] shadow-[15px_15px_0px_0px_#000] min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">
            <Target size={14} className="text-green-600" /> Question
          </div>
          <h2 className="text-3xl font-black text-center uppercase italic break-words w-full">
            {current?.front}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current?.options?.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="group flex items-center p-5 bg-white border-2 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] hover:bg-green-600 hover:text-white transition-all text-left uppercase font-black italic"
            >
              <span className="mr-4">{String.fromCharCode(65 + i)}.</span> {opt}
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
  userAnswers,
}: any) {
  const [showReview, setShowReview] = useState(false);
  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-6 bg-white min-h-screen">
        <header className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h2 className="text-3xl font-black uppercase italic">
            Xem lại bài làm
          </h2>
          <button
            onClick={() => setShowReview(false)}
            className="p-2 border-2 border-black rounded-xl hover:bg-red-500 hover:text-white"
          >
            <X size={24} />
          </button>
        </header>
        <div className="space-y-6">
          {userAnswers.map((ans: any, i: number) => {
            const isCorrect = ans.userChoice === ans.correctAnswer;
            return (
              <div
                key={i}
                className="p-6 border-4 border-black rounded-[24px] shadow-[8px_8px_0px_0px_#000] bg-white"
              >
                <h3 className="text-xl font-black uppercase mb-4">
                  Câu {i + 1}: {ans.front}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ans.options.map((opt: string, j: number) => {
                    let bg = "bg-slate-50";
                    if (opt === ans.correctAnswer) bg = "bg-green-400";
                    else if (opt === ans.userChoice)
                      bg = "bg-red-500 text-white";
                    return (
                      <div
                        key={j}
                        className={`p-4 border-[3px] border-black rounded-xl font-bold italic ${bg}`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-sm w-full border-4 border-black p-10 rounded-[40px] shadow-[15px_15px_0px_0px_#000] text-center">
        <Trophy size={60} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-black uppercase">Kết quả</h2>
        <div className="text-8xl font-black text-green-600 italic">
          {score}%
        </div>
        <p className="font-bold mb-8 text-slate-500">
          Đúng {correctCount} / {totalCount} câu
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowReview(true)}
            className="w-full py-4 bg-amber-400 font-black border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] uppercase italic"
          >
            Xem lại
          </button>
          <button
            onClick={() => router.push(`/users/flashcard/${folderId}`)}
            className="w-full py-4 bg-green-600 text-white font-black border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] uppercase italic"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
