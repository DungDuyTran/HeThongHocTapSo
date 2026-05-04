import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { mcpTools } from "@/lib/mcp-tools";

export async function POST(req: Request) {
  try {
    const { message, userId, role } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = "https://api.deepseek.com/chat/completions";

    const systemInstruction = `Bạn là "Smart Study AI". Phong cách: Thân thiện, xưng "Tui", gọi "Bạn".
    DƯỚI ĐÂY LÀ CÁC CÔNG CỤ BẠN CÓ:
    1. query_learning_material("từ_khóa"): Dùng khi tra cứu tài liệu hoặc tóm tắt file.
    2. get_system_stats(): Dùng khi ADMIN hỏi về số lượng học viên/tài liệu.
    3. get_system_guide("chủ_đề"): Dùng để hướng dẫn người dùng thao tác trên hệ thống. 
       Chủ đề: "thông_tin_ca_nhan", "them_tai_lieu", "tao_flashcard".

    QUY ĐỊNH VỀ ĐỊNH DẠNG:
    - TUYỆT ĐỐI KHÔNG sử dụng Markdown (** hoặc ###).
    - Xuống dòng bằng phím Enter bình thường.
    QUY TẮC GỌI TOOL:
    - Nếu cần dùng tool, CHỈ TRẢ VỀ duy nhất cú pháp: CALL_TOOL: tên_tool("tham_số")
    - Tuyệt đối không nói gì thêm khi gọi tool.

    QUY TẮC TẠO FLASHCARD:
    - Trả về JSON theo định dạng sau:
    FLASHCARDS_DATA: {
      "name": "Tên bộ thẻ",
      "cards": [{"front": "Mặt trước", "back": "Mặt sau"}]
    }`;

    const res1 = await axios.post(
      apiUrl,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message },
        ],
      },
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );

    let aiResponse = res1.data.choices[0].message.content.trim();
    let dbResult: any = null;
    let contextPrompt = "";

    // --- PHẦN XỬ LÝ TOOL CALL ---
    if (aiResponse.includes("CALL_TOOL:")) {
      if (aiResponse.includes("query_learning_material")) {
        const match = aiResponse.match(/"([^"]+)"/);
        let keyword = match ? match[1] : "";
        keyword = keyword.replace(/^file:/i, "").trim();
        dbResult = await mcpTools.query_learning_material(
          Number(userId),
          keyword,
        );
        contextPrompt = "NỘI DUNG TÀI LIỆU:";
      } else if (aiResponse.includes("get_system_stats")) {
        dbResult = await mcpTools.get_system_stats("Admin");
        console.log("Dữ liệu thống kê trả về:", dbResult);
        contextPrompt = "SỐ LIỆU THỐNG KÊ HỆ THỐNG (CHỈ DÀNH CHO ADMIN):";
      } else if (aiResponse.includes("get_system_guide")) {
        const match = aiResponse.match(/"([^"]+)"/);
        const topic = match ? match[1] : "";
        if (topic === "thông_tin_ca_nhan") {
          aiResponse =
            "Để thay đổi thông tin cá nhân, Bạn nhấn vào ô góc phải trên để hiện bảng thông tin rồi chỉnh sửa nhé!";
        } else if (topic === "them_tai_lieu") {
          aiResponse =
            "Để thêm tài liệu, Bạn vào mục Tài liệu, tải tài liệu lên và chờ tui lưu vào hệ thống.";
        } else if (topic === "tao_flashcard") {
          aiResponse =
            "Để tạo bộ thẻ, Bạn vào phần Flashcard, click 'Tạo thư mục' rồi đặt tên và xác nhận.";
        }
      }
    }

    // --- NẾU CÓ DỮ LIỆU TỪ DB (TÀI LIỆU HOẶC THỐNG KÊ) ---
    if (dbResult) {
      let dataForAI =
        Array.isArray(dbResult) && dbResult.length > 0 && dbResult[0].content
          ? dbResult[0].content
          : JSON.stringify(dbResult);
      let dataTitle = dbResult[0]?.title || "Dữ liệu hệ thống";

      const res2 = await axios.post(
        apiUrl,
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Bạn là Smart Study AI. Hãy dùng dữ liệu hệ thống cung cấp để thực hiện yêu cầu.",
            },
            { role: "user", content: message },
            { role: "assistant", content: aiResponse },
            {
              role: "user",
              content: `${contextPrompt}\n\n${dataForAI}\n\nNhiệm vụ quan trọng:
            - Nếu người dùng yêu cầu tạo flashcard, Bạn PHẢI trả về JSON FLASHCARDS_DATA ngay lập tức.
            - Tuyệt đối KHÔNG ĐƯỢC hỏi lại người dùng (không hỏi số lượng, không hỏi chủ đề). 
            - Tự động chọn lọc ra 15 từ vựng/kiến thức quan trọng nhất từ tài liệu trên để làm thẻ.
            - Phải đảm bảo đúng định dạng JSON để hệ thống tự động xử lý lưu trữ.`,
            },
          ],
        },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );

      aiResponse = res2.data.choices[0].message.content;
      const isFlashcardResponse =
        aiResponse.includes("FLASHCARDS_DATA:") ||
        aiResponse.includes('"flashcards":');

      // Xử lý lưu Flashcard tự động
      if (isFlashcardResponse) {
        try {
          // 1. Dùng Regex để lấy khối JSON { ... } chuẩn nhất, loại bỏ ```json hay văn bản thừa
          const jsonMatch = aiResponse.match(/({[\s\S]*})/);

          if (jsonMatch) {
            const flashData = JSON.parse(jsonMatch[1].trim());

            // 2. Lấy mảng thẻ học (AI có thể trả về key là 'cards' hoặc 'flashcards')
            const rawCards = flashData.cards || flashData.flashcards || [];
            const cardsArray = Array.isArray(rawCards) ? rawCards : [];

            if (cardsArray.length > 0) {
              // 3. TẠO THƯ MỤC (Folder)
              // Lấy tên bộ thẻ từ AI, nếu không có thì lấy tên tài liệu hoặc tên mặc định
              const folderName =
                flashData.name ||
                (dbResult && dbResult[0]
                  ? `Bộ thẻ từ ${dbResult[0].title}`
                  : "Bộ thẻ AI mới");

              const newFolder = await prisma.flashcardFolder.create({
                data: {
                  name: folderName,
                  userId: Number(userId),
                },
              });

              // 4. TẠO CÁC THẺ (Cards) VÀ GÁN VÀO THƯ MỤC
              // Ánh xạ linh hoạt: front (mặt trước) có thể là 'front', 'word', hoặc 'term'
              // back (mặt sau) có thể là 'back', 'definition', hoặc 'meaning'
              await prisma.flashcard.createMany({
                data: cardsArray.slice(0, 15).map((card: any) => ({
                  front: String(
                    card.front || card.word || card.term || "Mặt trước",
                  ),
                  back: String(
                    card.back || card.definition || card.meaning || "Mặt sau",
                  ),
                  folderId: newFolder.id,
                })),
              });

              aiResponse = `Tui đã tạo xong thư mục "${newFolder.name}" và thêm ${cardsArray.length} thẻ học vào hệ thống cho Bạn rồi nhé!`;
            }
          }
        } catch (e) {
          console.error("LỖI XỬ LÝ TẠO THƯ MỤC/THẺ:", e);
        }
      }
    }

    // Lưu lịch sử chat
    await prisma.chatHistory.createMany({
      data: [
        { userId: Number(userId), role: "user", message: message },
        { userId: Number(userId), role: "model", message: aiResponse },
      ],
    });

    return NextResponse.json({ reply: aiResponse });
  } catch (error: any) {
    console.error("LỖI API:", error.message);
    return NextResponse.json(
      { reply: "Hệ thống bận tí, thử lại sau nhé!" },
      { status: 500 },
    );
  }
}
