"use client";
import React from "react";
import { X } from "lucide-react";

export default function HistoryReviewModal({ data, onClose }: any) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] border-4 border-black rounded-[32px] shadow-[15px_15px_0px_0px_#000] flex flex-col overflow-hidden relative">
        <header className="p-6 border-b-4 border-black flex justify-between items-center bg-yellow-400 flex-shrink-0">
          <h2 className="text-2xl font-black uppercase italic text-black truncate pr-4">
            Bài làm: {data.folder.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white border-2 border-black rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000]"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto no-scrollbar space-y-6 bg-slate-50 flex-1">
          {data.details?.map((ans: any, i: number) => (
            <div
              key={i}
              className="p-6 border-4 border-black rounded-[24px] shadow-[6px_6px_0px_0px_#000] bg-white"
            >
              <h3 className="text-lg font-black uppercase italic mb-4">
                Câu {i + 1}: {ans.front}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ans.options.map((opt: string, j: number) => {
                  const isCorrectAnswer = opt === ans.correctAnswer;
                  const isUserChoice = opt === ans.userChoice;
                  let bgClass = "bg-white border-slate-300 text-slate-500";
                  if (isCorrectAnswer)
                    bgClass =
                      "bg-green-400 border-black text-black shadow-[2px_2px_0px_0px_#000]";
                  else if (isUserChoice && !isCorrectAnswer)
                    bgClass =
                      "bg-red-500 border-black text-white shadow-[2px_2px_0px_0px_#000]";

                  return (
                    <div
                      key={j}
                      className={`p-4 border-[3px] rounded-xl font-bold uppercase italic flex justify-between items-center transition-all ${bgClass}`}
                    >
                      <span className="text-xs">
                        {String.fromCharCode(65 + j)}. {opt}
                      </span>
                      {isCorrectAnswer && (
                        <span className="text-[8px] bg-black text-white px-2 py-1 rounded-md">
                          ĐÚNG
                        </span>
                      )}
                      {isUserChoice && !isCorrectAnswer && (
                        <span className="text-[8px] bg-white text-red-500 px-2 py-1 rounded-md border border-red-500">
                          BẠN CHỌN
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
