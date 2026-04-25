process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, userId, role } = await req.json();
    const isAdmin = role === "ADMIN";
    console.log("--- CHECK DATA ---");
    console.log("User ID:", userId);
    console.log("API Key tồn tại không:", !!process.env.GEMINI_API_KEY);
    const apiKey = process.env.GEMINI_API_KEY;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let systemInstruction = `Bạn là "Smart Study AI". Phong cách: Thân thiện, xưng "Tui", gọi "Bạn".
    QUY ĐỊNH QUAN TRỌNG: 
    - Chỉ sử dụng văn bản thuần túy (Plain text), KHÔNG dùng Markdown (** hoặc __).
    - KHÔNG tự ý tóm tắt tài liệu trừ khi người dùng yêu cầu hoặc câu hỏi liên quan trực tiếp đến kiến thức trong tài liệu.
    - Nếu người dùng hỏi về cách sử dụng hệ thống (đổi thông tin, tải file...), hãy trả lời ngay dựa trên HƯỚNG DẪN HỆ THỐNG bên dưới.`;

    if (isAdmin) {
      systemInstruction += `
      BẠN ĐANG TRÒ CHUYỆN VỚI QUẢN TRỊ VIÊN.
      DỮ LIỆU HỆ THỐNG (Bảng User):
      - Cột vai trò là: vaitro
      - Giá trị học viên là: 'HocVien'
      - Giá trị admin là: 'QuanTri'
      
      HƯỚNG DẪN TRUY VẤN CHO ADMIN:
      - Hỏi số học viên: QUERY: SELECT COUNT(*) as total FROM user WHERE vaitro = 'HocVien'
      - Hỏi số tài liệu: QUERY: SELECT COUNT(*) as total FROM document
      - Hỏi tài liệu mới nhất: QUERY: SELECT title FROM document ORDER BY createdAt DESC LIMIT 5
      - Hỏi tên các học viên: QUERY: SELECT hoTen FROM user WHERE vaitro = 'HocVien' LIMIT 10
      `;
    } else {
      systemInstruction += `
      HƯỚNG DẪN HỆ THỐNG (ƯU TIÊN):
      1. Đổi thông tin cá nhân (Họ tên, Email, SĐT, Ngày sinh): Bạn nhấn vào biểu tượng hình người (Avatar) ở góc trên bên phải màn hình -> Chọn mục tương ứng cần sửa -> Nhập thông tin mới -> Nhấn Lưu.
      2. Tải tài liệu: Vào menu "Tài liệu" -> Nhấn nút "Tải lên".
      3. Tạo Flashcard: Vào menu "Flashcard" -> Nhấn "Tạo mới".

      QUY TẮC TRUY VẤN TÀI LIỆU:
      - Chỉ khi người dùng hỏi về kiến thức, nội dung chuyên môn, hoặc yêu cầu tóm tắt file, bạn mới được dùng lệnh QUERY.
      - QUERY: SELECT title, content FROM document WHERE userId = ${userId} AND (title LIKE '%từ_khóa%' OR content LIKE '%từ_khóa%') LIMIT 1
      - Nếu người dùng chỉ chào hỏi hoặc hỏi cách dùng web, TUYỆT ĐỐI KHÔNG dùng QUERY.      
      
      HƯỚNG DẪN TẠO FLASHCARD TỰ ĐỘNG:
      - Khi người dùng muốn tạo bộ thẻ Flashcard từ tài liệu, hãy phân tích nội dung và trả về JSON theo mẫu chính xác sau:
      FLASHCARDS_DATA: {
      "name": "Tên bộ thẻ (Ví dụ: Từ vựng Tiếng Anh chuyên ngành)",
      "cards": [
      {"front": "Mặt trước (Khái niệm)", "back": "Mặt sau (Định nghĩa)"},
      {"front": "Mặt trước 2", "back": "Mặt sau 2"}
        ]
      }`;
    }

    const oldMessages = await prisma.chatHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" }, // Lấy mới nhất trước
      take: 10,
    });
    const history = oldMessages.reverse();

    const chatContent = [
      ...oldMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.message }],
      })),
      {
        role: "user",
        parts: [
          {
            text: `${systemInstruction}\n\nCâu hỏi của người dùng: ${message}`,
          },
        ],
      },
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
        let sql = aiResponse
          .split("QUERY:")[1]
          .trim()
          .replace(/```sql|```/g, "")
          .replace(/;/g, "");

        if (!isAdmin && sql.toUpperCase().includes("FROM USER")) {
          return NextResponse.json({
            reply: "Tui chỉ có quyền lục tài liệu học tập của Bạn thôi nè!",
          });
        }

        console.log("AI ĐANG TRUY VẤN SQL:", sql);
        const dbData = (await prisma.$queryRawUnsafe(sql)) as any[];

        let contextForAI = "";
        if (!dbData || dbData.length === 0) {
          contextForAI =
            "Tui đã tìm trong kho nhưng không thấy tài liệu nào liên quan đến câu hỏi của Bạn.";
        } else {
          const title = dbData[0].title || "Không tên";
          const content = dbData[0].content || "";
          // Cắt nội dung còn 8000 ký tự để tránh lỗi "Payload Too Large" (413)
          contextForAI = `NỘI DUNG TỪ FILE "${title}": ${content.substring(0, 8000)}`;
        }

        const res2 = await axios.post(apiUrl, {
          contents: [
            ...chatContent,
            { role: "model", parts: [{ text: aiResponse }] },
            {
              role: "user",
              parts: [
                {
                  text: `${contextForAI}\n\nBạn hãy dựa vào nội dung tui vừa tìm được để trả lời câu hỏi ban đầu của tui thật thân thiện và súc tích nhé.`,
                },
              ],
            },
          ],
        });
        aiResponse = res2.data.candidates[0].content.parts[0].text;
      } catch (e: any) {
        console.error("LỖI SQL HOẶC AI LẦN 2:", e.message);
        aiResponse =
          "Tui gặp chút rắc rối khi lục lại bộ nhớ tài liệu. Bạn thử hỏi lại kiểu khác xem!";
      }
    }
    if (aiResponse.includes("FLASHCARDS_DATA:")) {
      try {
        const jsonStr = aiResponse.split("FLASHCARDS_DATA:")[1].trim();
        const flashData = JSON.parse(jsonStr);

        // 1. Tạo Folder mới cho Flashcard
        const folder = await prisma.flashcardFolder.create({
          data: {
            name: flashData.name,
            userId: Number(userId),
          },
        });

        // 2. Insert hàng loạt các card
        if (folder && flashData.cards.length > 0) {
          await prisma.flashcard.createMany({
            data: flashData.cards.map((card: any) => ({
              front: card.front,
              back: card.back,
              folderId: folder.id,
            })),
          });

          const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { hoTen: true },
          });

          await prisma.auditLog.create({
            data: {
              userId: Number(userId),
              userName: user?.hoTen || "Học viên",
              action: "TẠO BỘ THẺ TỰ ĐỘNG",
              table: "flashcardfolder",
              detail: `AI đã tạo bộ thẻ: ${flashData.name} (${flashData.cards.length} thẻ)`,
              type: "CREATE",
            },
          });
          aiResponse = `Tui đã soạn xong bộ thẻ "${flashData.name}" với ${flashData.cards.length} thẻ dựa trên tài liệu của Bạn. Bạn kiểm tra trong mục Flashcard nhé!`;
        }
      } catch (parseError) {
        console.error("LỖI XỬ LÝ FLASHCARD:", parseError);
        aiResponse =
          "Tui trích xuất dữ liệu Flashcard bị lỗi một chút, bro thử yêu cầu lại nhé!";
      }
    }
    // Lưu lịch sử (CreateMany)
    await prisma.chatHistory.createMany({
      data: [
        { userId: Number(userId), role: "user", message: message },
        { userId: Number(userId), role: "model", message: aiResponse },
      ],
    });
    // Kiểm tra tổng số tin nhắn của user này
    const chatCount = await prisma.chatHistory.count({
      where: { userId: Number(userId) },
    });
    return NextResponse.json({ reply: aiResponse });
  } catch (error: any) {
    console.log("LỖI TỔNG:", error.response?.data || error.message);
    return NextResponse.json(
      { reply: "Server AI đang bận tí bạn ơi, đợi vài giây thử lại nhé!" },
      { status: 500 },
    );
  }
}
