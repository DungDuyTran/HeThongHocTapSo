"use client";
import { usePathname } from "next/navigation";
import { ChatAI } from "@/components/Chatbot"; 

export default function ChatWrapper() {
  const pathname = usePathname();
  
  // Danh sách các trang KHÔNG hiện bot
  const publicPaths = ["/", "/login", "/register"];
  const showChat = !publicPaths.includes(pathname);

  if (!showChat) return null;

  return <ChatAI />;
}