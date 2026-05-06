import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { mcpTools } from "@/lib/mcp-tools";

export async function POST(req: Request) {
  try {
    const { message, userId, role } = await req.json();
    const pastMessages = await prisma.chatHistory.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "asc" }, // Lấy từ cũ đến mới
      take: -6, // Lấy 6 tin gần nhất (dấu trừ để lấy từ cuối danh sách lên)
    });
    const historyForAI = pastMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.message,
    }));
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = "https://api.deepseek.com/chat/completions";

    const now = new Date();
    const vnTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    );

    const yyyy = vnTime.getFullYear();
    const mm = String(vnTime.getMonth() + 1).padStart(2, "0");
    const dd = String(vnTime.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const tomorrowTime = new Date(vnTime);
    tomorrowTime.setDate(tomorrowTime.getDate() + 1);
    const tm_yyyy = tomorrowTime.getFullYear();
    const tm_mm = String(tomorrowTime.getMonth() + 1).padStart(2, "0");
    const tm_dd = String(tomorrowTime.getDate()).padStart(2, "0");
    const tomorrowStr = `${tm_yyyy}-${tm_mm}-${tm_dd}`;

    const systemInstruction = `Bạn là "Smart Study AI" - một trợ lý chuyên biệt cho hệ thống học tập số. 
    Phong cách: Thân thiện, xưng "Tui", gọi "Bạn".

    QUY ĐỊNH PHẠM VI TRẢ LỜI:
    - Bạn CHỈ trả lời các câu hỏi liên quan đến học tập, tài liệu, quản lý thời gian và hướng dẫn sử dụng hệ thống.
    - Nếu người dùng hỏi các chủ đề ngoài lề (ví dụ: chính trị, showbiz, đời tư nghệ sĩ, hoặc các câu hỏi linh tinh không phục vụ mục đích học tập), hãy khéo léo từ chối: "Xin lỗi nè, tui là trợ lý học tập nên chỉ có thể giúp Bạn những việc liên quan đến nghiên cứu và sắp xếp lịch trình thôi. Chúng mình quay lại chuyện học nhé!".

    DƯỚI ĐÂY LÀ CÁC CÔNG CỤ BẠN CÓ:
    1. query_learning_material("từ_khóa"): Dùng khi tra cứu tài liệu hoặc tóm tắt file.
    2. get_system_stats(): Dùng khi ADMIN hỏi về số lượng học viên/tài liệu.
    3. get_system_guide("chủ_đề"): Dùng để hướng dẫn người dùng thao tác trên hệ thống. 
       Chủ đề: "thông_tin_ca_nhan", "them_tai_lieu", "tao_flashcard".

    QUY TẮC BẮT BUỘC:
    - Nếu Bạn thấy tên file (ví dụ: .docx, .pdf) hoặc yêu cầu tóm tắt/tạo flashcard/lập lịch từ tài liệu, Bạn BẮT BUỘC phải dùng CALL_TOOL: query_learning_material("tên_file_hoặc_từ_khóa") để đọc dữ liệu trước. 
    - Tuyệt đối không được đoán nội dung nếu chưa gọi tool.
    - Định dạng tool call duy nhất: CALL_TOOL: tên_tool("tham_số").

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
    }
      
    QUY TẮC TẠO LỊCH HỌC (SCHEDULE):
    - Khi người dùng muốn lập lịch học/lộ trình từ tài liệu, hãy phân tích nội dung và chia nhỏ thành các buổi học cụ thể.
    - Tuyệt đối không tự chế ra các tool như "generate_schedule...".
    - QUY ĐỊNH PHẢN HỒI: Nếu tạo lịch thành công, Bạn CHỈ ĐƯỢC PHÉP nói duy nhất câu: "Tui đã tạo lịch học dựa theo tài liệu của Bạn rồi đó!". Tuyệt đối không giải thích gì thêm.
    - Trả về JSON theo định dạng sau:
    SCHEDULE_DATA: {
      "events": [
        {
          "title": "Tên buổi học",
          "start": "YYYY-MM-DDTHH:mm",
          "end": "YYYY-MM-DDTHH:mm",
          "note": "Nội dung cần học trong tài liệu",
          "categoryId": "1"
        }
      ]
    }
    - LƯU Ý TỐI QUAN TRỌNG VỀ THỜI GIAN: 
      + Hôm nay là ngày ${todayStr}. BẮT BUỘC phải tạo các sự kiện bắt đầu từ ngày mai (${tomorrowStr}). 
      + Mỗi buổi học dài 2 tiếng. 
      + Trường "start" và "end" TUYỆT ĐỐI phải theo chuẩn YYYY-MM-DDTHH:mm (Ví dụ: "${tomorrowStr}T08:00"). Không được dùng định dạng DD/MM/YYYY.`;

    const res1 = await axios.post(
      apiUrl,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction },
          ...historyForAI,
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

      const res2 = await axios.post(
        apiUrl,
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Bạn là Smart Study AI. Thực hiện yêu cầu từ dữ liệu cung cấp.",
            },
            ...historyForAI,
            { role: "user", content: message },
            { role: "assistant", content: aiResponse },
            {
              role: "user",
              content: `${contextPrompt}\n\n${dataForAI}\n\nNHIỆM VỤ TỐI THƯỢNG (CHỈ THỰC HIỆN 1 TRONG CÁC CÁCH SAU):
              1. Nếu người dùng bảo TÓM TẮT (tóm tắt, nội dung file là gì, nói về cái gì...):
              - Bạn chỉ trả lời bằng văn bản tóm tắt nội dung tài liệu.
              - TUYỆT ĐỐI KHÔNG xuất JSON SCHEDULE_DATA hay FLASHCARDS_DATA.
              2. Nếu người dùng bảo TẠO FLASHCARD/BỘ THẺ:
              - Bạn xuất JSON FLASHCARDS_DATA. chọn lọc ra 15 từ vựng/kiến thức quan trọng nhất từ tài liệu trên để làm thẻ.
              - Trả lời xác nhận ngắn gọn.
              3. Nếu người dùng bảo TẠO LỊCH HỌC/THỜI GIAN BIỂU:
              - Bạn xuất JSON SCHEDULE_DATA (start/end format YYYY-MM-DDTHH:mm).
              - Câu trả lời text DUY NHẤT: "Tui đã tạo lịch học dựa theo tài liệu của Bạn rồi đó!".
              YÊU CẦU BỔ SUNG:
              - Nếu người dùng yêu cầu tạo flashcard, Bạn PHẢI trả về JSON FLASHCARDS_DATA ngay lập tức.
              - Tuyệt đối KHÔNG ĐƯỢC hỏi lại người dùng (không hỏi số lượng, không hỏi chủ đề). 
              - Tự động chọn lọc ra 15 từ vựng/kiến thức quan trọng nhất từ tài liệu trên để làm thẻ.
              - Phải đảm bảo đúng định dạng JSON để hệ thống tự động xử lý lưu trữ
              - Hôm nay là ngày ${todayStr}. Tạo lịch từ ngày ${tomorrowStr}.
              - Mỗi buổi học dài 2 tiếng. Giãn cách sáng/chiều/tối cho đẹp. 
              - Định dạng "start" và "end" BẮT BUỘC là YYYY-MM-DDTHH:mm.
              - Xuất JSON SCHEDULE_DATA: {"events": [...]}.
              ".`,
            },
          ],
        },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
      aiResponse = res2.data.choices[0].message.content;
    }

    // --- LOGIC QUAN TRỌNG: LUÔN KIỂM TRA LỊCH TRƯỚC KHI TRẢ VỀ (ĐÃ ĐƯA RA NGOÀI KHỐI IF) ---
    let autoSchedule = null;

    if (
      aiResponse.includes("SCHEDULE_DATA") ||
      aiResponse.includes('"events"')
    ) {
      try {
        const jsonMatch = aiResponse.match(/({[\s\S]*})/);

        if (jsonMatch) {
          let parsedData = JSON.parse(jsonMatch[1].trim());

          // Dọn dẹp dữ liệu để Frontend luôn nhận được MẢNG (Array) chuẩn xác
          if (
            parsedData.SCHEDULE_DATA &&
            Array.isArray(parsedData.SCHEDULE_DATA.events)
          ) {
            autoSchedule = parsedData.SCHEDULE_DATA.events;
          } else if (Array.isArray(parsedData.events)) {
            autoSchedule = parsedData.events;
          } else if (Array.isArray(parsedData)) {
            // Trường hợp AI trả về thẳng 1 array
            autoSchedule = parsedData;
          } else if (
            parsedData.SCHEDULE_DATA &&
            Array.isArray(parsedData.SCHEDULE_DATA)
          ) {
            autoSchedule = parsedData.SCHEDULE_DATA;
          }

          // Xử lý lỗi lồng mảng 2 lớp (như trong ảnh Console cũ)
          if (
            Array.isArray(autoSchedule) &&
            autoSchedule.length === 1 &&
            Array.isArray(autoSchedule[0])
          ) {
            autoSchedule = autoSchedule[0];
          }

          // Làm sạch aiResponse hiển thị
          if (autoSchedule && autoSchedule.length > 0) {
            aiResponse = aiResponse
              .split(jsonMatch[0])[0]
              .replace(/SCHEDULE_DATA:?/g, "")
              .replace(/```json?/g, "")
              .trim();
            if (!aiResponse)
              aiResponse = "Tui đã lập lịch học từ tài liệu cho Bạn rồi đó!";
          } else {
            autoSchedule = null; // Trả về null nếu mảng rỗng để không bị lỗi UI
          }
        }
      } catch (e) {
        console.error("LỖI PARSE LỊCH TẠI BACKEND:", e);
      }
    }
    // XỬ LÝ LƯU FLASHCARD TỰ ĐỘNG
    if (
      aiResponse.includes("FLASHCARDS_DATA:") ||
      aiResponse.includes('"flashcards":')
    ) {
      try {
        const jsonMatch = aiResponse.match(/({[\s\S]*})/);
        if (jsonMatch) {
          const flashData = JSON.parse(jsonMatch[1].trim());
          const rawCards = flashData.cards || flashData.flashcards || [];
          if (rawCards.length > 0) {
            const newFolder = await prisma.flashcardFolder.create({
              data: {
                name: flashData.name || `Bộ thẻ AI`,
                userId: Number(userId),
              },
            });
            await prisma.flashcard.createMany({
              data: rawCards.slice(0, 15).map((card: any) => ({
                front: String(
                  card.front || card.word || card.term || "Mặt trước",
                ),
                back: String(
                  card.back || card.definition || card.meaning || "Mặt sau",
                ),
                folderId: newFolder.id,
              })),
            });
            aiResponse = `Tui đã tạo xong thư mục "${newFolder.name}" và thêm ${rawCards.length} thẻ học cho Bạn rồi đó!`;
          }
        }
      } catch (e) {
        console.error("LỖI FLASHCARD:", e);
      }
    }
    aiResponse = aiResponse
      .replace(/```json?/g, "")
      .replace(/```/g, "")
      .trim();
    // Lưu lịch sử chat
    await prisma.chatHistory.createMany({
      data: [
        { userId: Number(userId), role: "user", message: message },
        { userId: Number(userId), role: "assistant", message: aiResponse },
      ],
    });

    return NextResponse.json({
      reply: aiResponse,
      ...(autoSchedule && { autoSchedule }),
    });
  } catch (error: any) {
    console.error("LỖI API:", error.message);
    return NextResponse.json(
      { reply: "Hệ thống bận tí, thử lại sau nhé!" },
      { status: 500 },
    );
  }
}
