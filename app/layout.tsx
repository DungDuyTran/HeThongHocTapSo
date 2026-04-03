import type { Metadata } from "next";
import { Lora, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ChatWrapper from "@/components/ChatWrapper";

// Cấu hình Metadata
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

        {/* Render cả ChatWrapper của bạn mình và Toaster của mình */}
        <ChatWrapper />
        <Toaster
          position="top-right"
          richColors
          closeButton
          // Cấu hình style "ngầu" mà bạn đã viết trong notifier.ts
          toastOptions={{
            style: {
              background: "white",
              border: "2px solid black",
              boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
              borderRadius: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
