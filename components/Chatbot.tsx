"use client";

import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { notifier } from "@/lib/notifier";

export const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Hàm lấy lịch sử từ Database
  const fetchHistory = useCallback(async () => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.id) return;

    setIsFetchingHistory(true);
    try {
      const res = await fetch(`/api/ai/history?userId=${user.id}`);
      const data = await res.json();

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Nếu chưa có lịch sử, hiện câu chào mặc định
        setMessages([
          {
            role: "assistant",
            content:
              "Chào bro! Tui là Smart Study AI đây. Bro cần tra cứu tài liệu hay hỏi gì không? 😉",
          },
        ]);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    } finally {
      setIsFetchingHistory(false);
    }
  }, []);

  // 2. Tự động load lịch sử khi người dùng nhấn MỞ hộp chat
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.id) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bạn cần đăng nhập để tui biết bạn là ai nhé!",
        },
      ]);
      return;
    }

    const userRole = user.vaiTro === "QuanTri" ? "Admin" : "HocVien";

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userId: user.id,
          role: userRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Hiển thị câu trả lời đã được làm sạch
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);

        // 2. XỬ LÝ LỊCH HỌC TỰ ĐỘNG

        if (
          data.autoSchedule &&
          Array.isArray(data.autoSchedule) &&
          data.autoSchedule.length > 0
        ) {
          try {
            const stored = localStorage.getItem("dtu_events_final");
            const currentEvents = stored ? JSON.parse(stored) : [];

            // Chuẩn hóa dữ liệu lịch
            const newEventsNormalized = data.autoSchedule.map((e: any) => ({
              id: crypto.randomUUID(),
              title: e.title || "Buổi học AI tạo",
              start: e.start,
              end: e.end,
              note: e.note || "",
              categoryId: String(e.categoryId || "1"),
              backgroundColor: "#16a34a", // Màu xanh lá cho đẹp
            }));

            // Gộp với lịch cũ và lưu vào localStorage
            const totalEvents = [...currentEvents, ...newEventsNormalized];
            localStorage.setItem(
              "dtu_events_final",
              JSON.stringify(totalEvents),
            );

            // Bắn tín hiệu để bảng FullCalendar cập nhật ngay lập tức
            window.dispatchEvent(new Event("storage"));

            // Bắn thông báo xanh
            notifier?.success(
              "Đã thêm vào lịch!",
              "Bạn kiểm tra thời gian biểu nhé.",
            );
          } catch (err) {
            console.error("Lỗi khi lưu lịch ở Frontend:", err);
          }
        }
      }
    } catch (err: any) {
      console.error("Lỗi gửi tin nhắn:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lỗi kết nối AI rồi bro ơi! Thử lại sau nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-all active:translate-y-1 active:shadow-none ${
          isOpen ? "bg-red-500" : "bg-blue-600"
        }`}
      >
        {isOpen ? (
          <X size={32} strokeWidth={3} />
        ) : (
          <Bot size={35} strokeWidth={2.5} className="animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white rounded-[32px] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-5 bg-blue-600 text-white border-b-4 border-black flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Bot size={24} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-black uppercase italic tracking-tight">
                Smart Study AI
              </span>
              <span className="text-[10px] font-bold uppercase opacity-80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                Đang trực tuyến
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fafc]">
            {isFetchingHistory ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Loader2 className="animate-spin" size={32} />
                <span className="font-bold text-xs uppercase italic">
                  Đang nhớ lại...
                </span>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 ${
                        msg.role === "user" ? "bg-yellow-400" : "bg-white"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User size={18} className="text-black" />
                      ) : (
                        <Bot size={18} className="text-blue-600" />
                      )}
                    </div>

                    <div
                      className={`max-w-[75%] p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[11px] font-bold leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-slate-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 font-black italic text-xs ml-12">
                <Loader2 size={14} className="animate-spin" />
                AI đang xử lý...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t-4 border-black flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhắn gì đó..."
              className="flex-1 bg-slate-50 border-2 border-black px-4 py-3 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
            />
            <button
              title="Gửi"
              onClick={handleSendMessage}
              className="p-3 bg-yellow-400 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Send size={20} className="text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
