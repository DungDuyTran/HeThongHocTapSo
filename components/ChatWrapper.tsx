"use client";
import { usePathname } from "next/navigation";
import { ChatAI } from "@/components/Chatbot"; 

export default function ChatWrapper() {
  const pathname = usePathname();
  
  // Danh sách các trang KHÔNG hiện bot
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];
  const showChat = !publicPaths.includes(pathname);

  if (!showChat) return null;

  return <ChatAI />;
}