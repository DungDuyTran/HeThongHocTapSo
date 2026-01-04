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
      {/* ================= HERO ================= */}
      <section
        className="relative min-h-screen flex items-center justify-center px-8 bg-cover bg-center mb-3"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/10" />

        {/* Auth */}
        <div className="absolute top-6 right-12 flex gap-4 z-20">
          <button
            className="px-5 py-2 rounded-xl bg-green-600 shadow-2xl text-white border-2 border-gray-200 hover:bg-white hover:text-green-600 transition"
            onClick={() => router.push("/auth/login")}
          >
            Đăng nhập
          </button>
          <button
            className="px-5 py-2 rounded-xl bg-green-600 shadow-2xl text-white border-2 border-gray-200 hover:bg-white hover:text-green-600 transition"
            onClick={() => router.push("/auth/register")}
          >
            Đăng ký
          </button>
        </div>

        <div className="relative z-10 max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-green-700 mb-6">
            Hệ thống thông minh hỗ trợ quản lý và tối ưu hóa lộ trình học tập cá
            nhân
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
        <div className="absolute inset-0 bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center text-green-700 mb-10">
            Hệ Sinh Thái Học Tập
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Calendar />}
              title="Thời Gian Biểu"
              desc="Xây dựng thời gian biểu học tập chi tiết theo ngày, tuần và tháng, giúp phân bổ thời gian hợp lý."
            />
            <FeatureCard
              icon={<CheckSquare />}
              title="To-do List Học Tập"
              desc="Quản lý danh sách công việc học tập, phân loại theo mức độ ưu tiên và trạng thái hoàn thành."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Thống Kê & Phân Tích"
              desc="Tự động tổng hợp dữ liệu học tập và hiển thị bằng biểu đồ trực quan."
            />
            <FeatureCard
              icon={<BookOpen />}
              title="Quản Lý Tài Liệu"
              desc="Lưu trữ, phân loại và truy cập tài liệu học tập nhanh chóng và khoa học."
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="Ghi Chú & Nhắc Nhở"
              desc="Hỗ trợ ghi chú trong quá trình học và nhắc nhở các mốc thời gian quan trọng."
            />
            <FeatureCard
              icon={<Layers />}
              title="Nền Tảng Tích Hợp"
              desc="Tích hợp toàn bộ chức năng học tập trong một hệ thống duy nhất, liền mạch và hiệu quả."
            />
          </div>
        </div>
      </section>

      {/* ================= CORE TOOLS ================= */}
      <section
        className="relative py-24 bg-cover bg-center mb-3"
        style={{ backgroundImage: "url('/bg3.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/10" />

        <div className="relative max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-700 mb-16">
            Chức Năng Chính
          </h2>

          <div className="flex flex-col lg:flex-row gap-10">
            <ToolCard
              title="Quản Lý Thời Gian & Công Việc"
              desc="Hỗ trợ xây dựng kế hoạch học tập rõ ràng, cân bằng giữa học tập và nghỉ ngơi."
              items={[
                "Lập lịch học theo ngày – tuần – tháng",
                "Kéo thả công việc linh hoạt",
                "Ưu tiên và phân loại nhiệm vụ",
              ]}
            />

            <ToolCard
              title="Theo Dõi & Đánh Giá Hiệu Suất"
              desc="Theo dõi tiến độ học tập và đánh giá hiệu quả thông qua dữ liệu trực quan."
              items={[
                "Biểu đồ tiến độ học tập",
                "Phân tích dữ liệu theo thời gian",
                "Điều chỉnh kế hoạch học phù hợp",
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
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Trí Tuệ Nhân Tạo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Cpu />}
              title="Cá Nhân Hóa Lộ Trình"
              desc="Đề xuất lộ trình học tập phù hợp với từng người học."
            />
            <FeatureCard
              icon={<Activity />}
              title="Phân Tích Hiệu Suất"
              desc="Đánh giá hiệu quả học tập dựa trên dữ liệu thực tế."
            />
            <FeatureCard
              icon={<Target />}
              title="Tối Ưu Kế Hoạch"
              desc="Điều chỉnh lịch học một cách thông minh."
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="Hỗ Trợ 24/7"
              desc="Trợ lý học tập luôn sẵn sàng hỗ trợ người học."
            />
          </div>
        </div>
      </section>
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
    <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-green-700 hover:scale-[1.03] transition">
      <div className="flex justify-center text-green-700 mb-2">
        {React.cloneElement(icon as React.ReactElement, { size: 34 })}
      </div>
      <h3 className="text-xl font-bold text-center mb-2 text-green-700">
        {title}
      </h3>
      <p className="text-sm text-gray-700 text-center leading-relaxed">
        {desc}
      </p>
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
    <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-green-700 flex-1">
      <h3 className="text-2xl font-bold text-center mb-4 text-green-700">
        {title}
      </h3>
      <p className="text-gray-700 text-center mb-6">{desc}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <CheckCircle size={18} className="text-green-700 mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
