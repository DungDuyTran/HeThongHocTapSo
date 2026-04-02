import type { Metadata } from "next";
import { Lora, Geist } from "next/font/google";
import "./globals.css";
import ChatWrapper from "@/components/ChatWrapper";

// Cấu hình Metadata để đổi tên trang web trên tab trình duyệt
export const metadata: Metadata = {
  title: "Trợ lý học tập - Smart Study AI",
  description:
    "Hệ thống thông minh hỗ trợ quản lý và tối ưu hóa lộ trình học tập cá nhân",
  icons: {
    icon: "/favicon.ico",
  },
};

const lora = Lora({
  subsets: ["vietnamese"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="no-scrollbar">
      <body
        className={`${geistSans.variable} ${lora.variable} bg-white antialiased no-scrollbar`}
      >
        {children}
        <ChatWrapper />
      </body>
    </html>
  );
}