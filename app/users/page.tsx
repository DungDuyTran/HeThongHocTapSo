"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const features = [
    {
      title: "Thời gian biểu",
      path: "/users/calendar",
    },
    {
      title: "Todo List",
      path: "/users/todo",
    },
    {
      title: "Đánh giá học tập",
      path: "/users/statistics",
    },
    {
      title: "FlashCard",
      path: "/users/flashcard",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-auto">
        {features.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(item.path)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              {item.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
