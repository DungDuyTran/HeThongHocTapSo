process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json(); // Nhận userId từ Frontend
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    //Lấy 6 tin nhắn gần nhất từ DB để làm ngữ cảnh 
    const oldMessages = await prisma.chatHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'asc' },
      take: 6
    });

    // Xây dựng System Prompt 
    const systemInstruction = `
      Bạn là "Smart Study AI" - Trợ lý của "Hệ Thống Học Tập Số".
      NHIỆM VỤ: Trả lời dựa trên dữ liệu từ Database MySQL.
      CẤU TRÚC DB:
      - user (id, hoTen, email, vaiTro)
      - document (id, title, userId)
      - flashcardfolder (id, name, userId)

      QUY TẮC:
      - Nếu cần dữ liệu thực tế, CHỈ trả lời định dạng: QUERY: <SQL chuẩn 1 dòng>
      - KHÔNG dùng dấu nháy ngược (\` \` \`), KHÔNG giải thích trong SQL.
      - Nếu là câu hỏi thường, trả lời thân thiện, xưng "Tui", gọi "Bro".
    `;

    // Chuẩn bị nội dung gửi đi (Gộp Lịch sử + Câu hỏi mới)
    const chatContent = [
      { role: "user", parts: [{ text: systemInstruction }] }, // Nạp luật trước
      ...oldMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.message }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    // Gọi AI lần 1
    const res1 = await axios.post(apiUrl, { contents: chatContent });
    let aiResponse = res1.data.candidates[0].content.parts[0].text;

    // Xử lý nếu AI đòi SQL
    if (aiResponse.includes("QUERY:")) {
      let sql = aiResponse.split("QUERY:")[1].trim().replace(/```sql|```/g, "");
      try {
        const dbData = await prisma.$queryRawUnsafe(sql);
        // Gửi data ngược lại cho AI để nó trả lời tiếng Việt
        const res2 = await axios.post(apiUrl, {
          contents: [
            ...chatContent,
            { role: "model", parts: [{ text: aiResponse }] },
            { role: "user", parts: [{ text: `Dữ liệu thật từ DB: ${JSON.stringify(dbData)}. Hãy trả lời thân thiện.` }] }
          ]
        });
        aiResponse = res2.data.candidates[0].content.parts[0].text;
      } catch (e) {
        aiResponse = "Tui tra cứu bị lỗi SQL rồi bro ơi!";
      }
    }

    // LƯU LỊCH SỬ VÀO DATABASE (Để lần sau nó nhớ)
    await prisma.chatHistory.createMany({
      data: [
        { userId: Number(userId), role: "user", message: message },
        { userId: Number(userId), role: "model", message: aiResponse }
      ]
    });

    return NextResponse.json({ reply: aiResponse });

  } catch (error: any) {
    console.error("LỖI CHATBOT:", error.message);
    return NextResponse.json({ reply: "Lỗi kết nối AI rồi bro!" }, { status: 500 });
  }
}