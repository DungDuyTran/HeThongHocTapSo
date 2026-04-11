import type { Metadata } from "next";
import { Lora, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ChatWrapper from "@/components/ChatWrapper";

// Cấu hình Metadata
export const metadata: Metadata = {
  title: "Trợ lý học tập - Smart Study AI",
  description:
    "THIẾT KẾ VÀ PHÁT TRIỂN NỀN TẢNG HỌC TẬP THÔNG MINH TÍCH HỢP TRỢ LÝ ẢO AI VÀ CÁ NHÂN HOÁ LỘ TRÌNH HỌC TẬP",
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
