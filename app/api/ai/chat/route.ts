process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();
    console.log("--- CHECK DATA ---");
    console.log("User ID:", userId);
    console.log("API Key tồn tại không:", !!process.env.GEMINI_API_KEY);
    const apiKey = process.env.GEMINI_API_KEY; 
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Lấy lịch sử chat
    const oldMessages = await prisma.chatHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'asc' },
      take: 10 
    });

    const systemInstruction = `Bạn là "Smart Study AI". 
      QUY TẮC PHẢN HỒI:
      1. Trả lời cực kỳ NGẮN GỌN, súc tích (không quá 3-4 câu).
      2. Sử dụng gạch đầu dòng (-) cho các bước hướng dẫn thay vì viết đoạn văn dài.
      3. KHÔNG sử dụng ký hiệu Markdown như ** hoặc # vì giao diện hiện tại không hỗ trợ. Hãy dùng VIẾT HOA các từ quan trọng.
      4. Luôn giữ phong cách thân thiện, xưng "Tui", gọi "Bro".
  
      HƯỚNG DẪN HỆ THỐNG:
      - Tạo Flashcard: Menu Flashcard -> Nút "Tạo mới" -> Nhập mặt trước/sau -> Lưu.
      - Tải tài liệu: Menu Tài liệu -> Nút "Tải lên" -> Chọn file từ máy -> Điền tên tài liệu -> Lưu.
      - Cập nhật số điện thoại: Biểu tượng người dùng -> Số điện thoại -> Nhập số mới -> Lưu.
      - Cập nhật họ tên: Biểu tượng người dùng -> Họ tên -> Nhập tên mới -> Lưu.
      - Cập nhật email: Biểu tượng người dùng -> Email -> Nhập email mới -> Lưu.
      - Cập nhật ngày sinh: Biểu tượng người dùng -> Ngày sinh -> Nhập ngày mới -> Lưu.
    `;

    const chatContent = [
      ...oldMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.message }]
      })),
      { role: "user", parts: [{ text: `${systemInstruction}\n\nCâu hỏi của người dùng: ${message}` }] }
    ];

    // Gọi AI lần 1
    const res1 = await axios.post(apiUrl, { contents: chatContent });
    
    // Kiểm tra an toàn dữ liệu trả về
    if (!res1.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("AI không trả về nội dung");
    }
    
    let aiResponse = res1.data.candidates[0].content.parts[0].text;

    // Xử lý SQL 
    if (aiResponse.includes("QUERY:")) {
      try {
        let sql = aiResponse.split("QUERY:")[1].trim().replace(/```sql|```/g, "").replace(/;/g, "");
        const dbData = await prisma.$queryRawUnsafe(sql);
        
        const res2 = await axios.post(apiUrl, {
          contents: [
            ...chatContent,
            { role: "model", parts: [{ text: aiResponse }] },
            { role: "user", parts: [{ text: `Dữ liệu thật từ DB: ${JSON.stringify(dbData)}. Hãy dựa vào đây trả lời thân thiện bằng tiếng Việt cho tui.` }] }
          ]
        });
        aiResponse = res2.data.candidates[0].content.parts[0].text;
      } catch (e) {
        console.error("Lỗi SQL:", e);
        aiResponse = "Tui định tra cứu DB mà bị lỗi SQL mất rồi bro!";
      }
    }

    // Lưu lịch sử (CreateMany)
    await prisma.chatHistory.createMany({
      data: [
        { userId: Number(userId), role: "user", message: message },
        { userId: Number(userId), role: "model", message: aiResponse }
      ]
    });
    // Kiểm tra tổng số tin nhắn của user này
    const chatCount = await prisma.chatHistory.count({
      where: { userId: Number(userId) }
    });
    // Nếu quá 30 tin nhắn (khoảng 15 cặp chat), xóa các tin nhắn cũ nhất
    const MAX_MESSAGES = 30;
    if (chatCount > MAX_MESSAGES) {
      // Tìm danh sách ID của những tin nhắn cũ vượt quá hạn mức
      const messagesToDelete = await prisma.chatHistory.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'asc' },
        take: chatCount - MAX_MESSAGES,
        select: { id: true }
      });

      // Xóa chúng khỏi DB
      await prisma.chatHistory.deleteMany({
        where: { id: { in: messagesToDelete.map(m => m.id) } }
      });
      console.log(`--- ĐÃ DỌN DẸP: Xóa ${messagesToDelete.length} tin nhắn cũ của User ${userId} ---`);
    }

    return NextResponse.json({ reply: aiResponse });

  } catch (error: any) {
    console.log("LỖI THẬT NÈ BRO:", JSON.stringify(error.response?.data, null, 2));
    return NextResponse.json({ reply: "Lỗi kết nối AI rồi bro! Kiểm tra lại Model hoặc API Key nhé." }, { status: 500 });
  }
}