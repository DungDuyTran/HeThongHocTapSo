"use client";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Calendar,
  CheckSquare,
  BarChart3,
  BookOpen,
  MessageSquare,
  Layers,
  CheckCircle,
  Cpu,
  Activity,
  Target,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-800 font-[TimesNewRoman]">
      {/* mở đầu */}
      <section
        className="relative min-h-screen flex items-center justify-center px-8 bg-cover bg-center mb-3"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      >
        <div className="absolute inset-0" />

        {/* Auth */}
        <div className="absolute top-6 right-12 flex gap-4 z-20">
          <button
            className="px-6 py-2.5 rounded-2xl bg-green-600 text-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-tight text-sm hover:bg-white hover:text-green-700"
            onClick={() => router.push("/auth/login")}
          >
            Đăng nhập
          </button>

          <button
            className="px-6 py-2.5 rounded-2xl bg-green-600 text-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase tracking-tight text-sm hover:bg-white hover:text-green-700"
            onClick={() => router.push("/auth/register")}
          >
            Đăng ký
          </button>
        </div>

        <div className="relative z-10 max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-green-700 mb-6">
            Nền tảng học tập thông minh tích hợp trợ lý ảo AI và cá nhân hóa lộ
            trình học tập
          </h1>

          <p className="text-xl md:text-2xl text-gray-700">
            Nền tảng học tập{" "}
            <span className="font-semibold text-green-700">
              All-in-one Ecosystem
            </span>{" "}
            cá nhân hóa lộ trình học tập bằng trí tuệ nhân tạo.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        className="relative py-24 bg-cover bg-center mb-3"
        style={{ backgroundImage: "url('/bg2.jpg')" }}
      >
        <div className="absolute inset-0" />

        <div className="relative max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center text-green-700 mb-6 mt-8">
            Hệ Sinh Thái Học Tập
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard
              icon={<Calendar size={44} />}
              title="Thời Gian Biểu"
              desc="Xây dựng thời gian biểu chi tiết theo ngày, tuần và tháng, giúp phân bổ thời gian học tập hợp lý."
            />
            <FeatureCard
              icon={<CheckSquare size={44} />}
              title="To-do List Học Tập"
              desc="Danh sách công việc học tập khoa học, hỗ trợ phân loại theo mức độ ưu tiên."
            />
            <FeatureCard
              icon={<BarChart3 size={44} />}
              title="Thống Kê & Phân Tích"
              desc="Tổng hợp dữ liệu học tập và hiển thị bằng biểu đồ trực quan."
            />
            <FeatureCard
              icon={<BookOpen size={44} />}
              title="Quản Lý Tài Liệu"
              desc="Lưu trữ, phân loại và truy cập tài liệu học tập nhanh chóng."
            />
            <FeatureCard
              icon={<MessageSquare size={44} />}
              title="Ghi Chú & Nhắc Nhở"
              desc="Hỗ trợ ghi chú và nhắc nhở các mốc thời gian quan trọng."
            />
            <FeatureCard
              icon={<Layers size={44} />}
              title="Nền Tảng Tích Hợp"
              desc="Tất cả chức năng học tập được tích hợp trong một hệ thống duy nhất."
            />
          </div>
        </div>
      </section>

      {/* ================= CORE TOOLS ================= */}
      <section
        className="relative py-24 bg-cover bg-center mb-3"
        style={{ backgroundImage: "url('/bg3.jpg')" }}
      >
        <div className="absolute inset-0" />

        <div className="relative max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center text-green-700 mb-16">
            Chức Năng Chính
          </h2>

          <div className="flex flex-col lg:flex-row gap-7">
            <ToolCard
              title="Quản Lý Thời Gian & Công Việc"
              desc="Giúp người học xây dựng kế hoạch học tập rõ ràng và hiệu quả."
              items={[
                "Lịch học theo ngày - tuần - tháng",
                "Kéo thả công việc linh hoạt",
                "Ưu tiên nhiệm vụ học tập",
              ]}
            />

            <ToolCard
              title="Theo Dõi & Đánh Giá Hiệu Suất"
              desc="Theo dõi tiến độ học tập và đánh giá hiệu quả lâu dài."
              items={[
                "Biểu đồ tiến độ học",
                "Phân tích dữ liệu theo thời gian",
                "Điều chỉnh kế hoạch học tập",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================= AI ================= */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-6.jpg')" }}
      >
        <div className="absolute inset-0" />

        <div className="relative max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center text-white mb-6">
            Trí Tuệ Nhân Tạo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AICard
              icon={<Cpu size={36} />}
              title="Cá Nhân Hóa Lộ Trình"
              desc="Đề xuất lộ trình học phù hợp với năng lực và mục tiêu cá nhân."
            />
            <AICard
              icon={<Activity size={36} />}
              title="Phân Tích Hiệu Suất"
              desc="Đánh giá hiệu quả học tập và phát hiện sớm vấn đề."
            />
            <AICard
              icon={<Target size={36} />}
              title="Tối Ưu Kế Hoạch"
              desc="Tự động điều chỉnh kế hoạch học tập thông minh."
            />
            <AICard
              icon={<MessageSquare size={36} />}
              title="Hỗ Trợ Học Tập 24/7"
              desc="Trợ lý AI hỗ trợ học tập mọi lúc, mọi nơi."
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white text-center py-2">
        <p className="text-black text-xl">
          © {new Date().getFullYear()} Trần Duy Dũng
        </p>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-green-700 hover:scale-105 transition scale-90">
      <div className="flex justify-center text-green-700">{icon}</div>
      <h3 className="text-2xl font-bold text-center mt-2 mb-2 text-green-700">
        {title}
      </h3>
      <p className="text-gray-700 text-center">{desc}</p>
    </div>
  );
}

function ToolCard({
  title,
  desc,
  items,
}: {
  title: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-green-700 flex-1 hover:scale-105 transition">
      <h3 className="text-3xl font-bold text-center mb-4 text-green-700">
        {title}
      </h3>
      <p className="text-gray-700 text-center mb-6 text-xl">{desc}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <CheckCircle size={15} className="text-green-700 mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AICard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-green-700 hover:scale-105 transition scale-90">
      <div className="flex justify-center text-green-700">{icon}</div>
      <h3 className="text-2xl font-bold text-center mt-2 mb-2 text-green-700">
        {title}
      </h3>
      <p className="text-gray-700 text-center">{desc}</p>
    </div>
  );
}
