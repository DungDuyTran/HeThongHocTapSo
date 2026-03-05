"use client";
import { useQuiz } from "../hooks/useQuiz";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function FlashcardQuiz({ cards, onFinish }: any) {
  const {
    currentCard,
    currentIndex,
    total,
    score,
    timer,
    isFinished,
    handleAnswer,
  } = useQuiz(cards);

  if (isFinished) {
    const finalPercent = (score / total) * 100;
    return (
      <div className="text-center p-10 border-[5px] border-black rounded-[40px] bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-5xl font-black mb-4">KẾT QUẢ</h2>
        <p className="text-8xl font-black mb-4">{finalPercent.toFixed(1)}%</p>
        <p className="text-xl font-bold mb-8">
          Bạn trả lời đúng {score}/{total} câu trong {timer} giây
        </p>
        <button
          onClick={() =>
            onFinish({ score: finalPercent, correct: score, time: timer })
          }
          className="px-10 py-4 bg-black text-white font-black rounded-2xl hover:bg-slate-800 transition-all"
        >
          LƯU LỊCH SỬ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header bài thi */}
      <div className="flex justify-between items-center bg-white p-6 border-[4px] border-black rounded-[25px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 font-black">
          <Clock className="text-blue-600" /> {timer}s
        </div>
        <div className="font-black">
          CÂU HỎI: {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Thẻ câu hỏi */}
      <div className="aspect-[4/3] flex items-center justify-center bg-white border-[5px] border-black rounded-[40px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] p-10">
        <h3 className="text-4xl font-black text-center leading-tight">
          {currentCard?.front}
        </h3>
      </div>

      {/* Nút bấm Đúng/Sai */}
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleAnswer(false)}
          className="flex flex-col items-center gap-2 p-6 bg-red-400 border-[4px] border-black rounded-[30px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
        >
          <XCircle size={40} strokeWidth={3} />
          <span className="font-black uppercase">Chưa thuộc</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="flex flex-col items-center gap-2 p-6 bg-green-400 border-[4px] border-black rounded-[30px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
        >
          <CheckCircle size={40} strokeWidth={3} />
          <span className="font-black uppercase">Đã thuộc</span>
        </button>
      </div>
    </div>
  );
}
