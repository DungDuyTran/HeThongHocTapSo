"use client";
import { useQuiz } from "../hooks/useQuiz";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FlashcardQuiz({ cards, folderId, onFinish }: any) {
  const router = useRouter();
  const { index, correct, timer, isFinished, handleAnswer, current } = useQuiz(
    folderId,
    cards,
  );

  const total = Array.isArray(cards) ? cards.length : 0;

  // CHẶN HIỂN THỊ NẾU KHÔNG ĐỦ 4 THẺ
  if (!Array.isArray(cards) || cards.length < 4) {
    return (
      <div className="max-w-2xl mx-auto p-10 border-[5px] border-black rounded-[40px] bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
        <AlertCircle size={60} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-black mb-4 uppercase italic">
          Chưa đủ dữ liệu
        </h2>
        <p className="text-lg font-bold mb-8 italic text-slate-600">
          Bạn cần ít nhất 4 thẻ để bắt đầu ôn tập chế độ này nhé!
        </p>
        <button
          onClick={() => (onFinish ? onFinish() : router.back())}
          className="px-10 py-4 bg-black text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase italic shadow-[4px_4px_0px_0px_#ef4444]"
        >
          Quay lại ngay
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="text-center p-10 border-[5px] border-black rounded-[40px] bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-5xl font-black mb-4 uppercase italic">KẾT QUẢ</h2>
        <p className="text-8xl font-black mb-4">
          {((correct / total) * 100).toFixed(1)}%
        </p>
        <p className="text-xl font-bold mb-8 italic">
          Bạn trả lời đúng {correct}/{total} câu trong {timer} giây
        </p>
        <button
          onClick={() => onFinish()}
          className="px-10 py-4 bg-black text-white font-black rounded-2xl uppercase border-2 border-white italic shadow-[4px_4px_0px_0px_#000]"
        >
          XONG
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 border-[4px] border-black rounded-[25px] shadow-[8px_8px_0px_0px_#000] font-black italic">
        <div className="flex items-center gap-2 text-2xl">
          <Clock className="text-blue-600" size={28} /> {timer}s
        </div>
        <div className="text-xl uppercase">
          CÂU HỎI: {index + 1} / {total}
        </div>
      </div>

      <div className="aspect-[4/3] flex items-center justify-center bg-white border-[5px] border-black rounded-[40px] shadow-[15px_15px_0px_0px_#000] p-10 text-center relative overflow-hidden">
        <h3 className="text-4xl font-black leading-tight text-slate-800 uppercase italic">
          {current?.front}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleAnswer("")}
          className="flex flex-col items-center gap-2 p-6 bg-red-400 border-[4px] border-black rounded-[30px] shadow-[6px_6px_0px_0px_#000] active:translate-y-1 transition-all"
        >
          <XCircle size={45} strokeWidth={3} />
          <span className="font-black uppercase italic">Chưa thuộc</span>
        </button>
        <button
          onClick={() => handleAnswer(current?.back || "")}
          className="flex flex-col items-center gap-2 p-6 bg-green-400 border-[4px] border-black rounded-[30px] shadow-[6px_6px_0px_0px_#000] active:translate-y-1 transition-all"
        >
          <CheckCircle size={45} strokeWidth={3} />
          <span className="font-black uppercase italic">Đã thuộc</span>
        </button>
      </div>
    </div>
  );
}
