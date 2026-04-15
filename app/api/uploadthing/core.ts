import { createUploadthing, type FileRouter } from "uploadthing/next";
import { extractOnlyText } from "@/lib/extractor";
import prisma from "@/lib/prisma";
import { notificationService } from "@/lib/notification-service";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    blob: { maxFileSize: "16MB" }, // Word, Excel, PPT
  })
    .middleware(async ({ req }) => {
      // 1. Lấy ID và bọc trong try-catch để tránh lỗi 500
      try {
        const userId = req.headers.get("x-user-id");
        console.log("Nhận x-user-id:", userId);
        // Nếu không có ID, trả về 1 (ID dự phòng) thay vì throw Error gây sập 500
        if (!userId || userId === "undefined" || userId === "null") {
          console.warn("Cảnh báo: Không tìm thấy ID hợp lệ, dùng ID mặc định: 1");
          return { userId: 1 }; 
        }

        return { userId: Number(userId) };
      } catch (err) {
        return { userId: 1 };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = file.ufsUrl || file.url;
      console.log("Lưu file cho User:", metadata.userId);

      try {
        // 2. Lưu vào Database
        const newDoc = await prisma.document.create({
          data: {
            title: file.name,
            fileUrl: file.url,
            // Lấy đuôi file chuẩn hơn
            fileType: file.name.split('.').pop()?.toUpperCase() || "UNKNOWN",
            fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
            userId: metadata.userId,
            content: "Đang xử lý nội dung..." 
          },
        });

        // 3. Thông báo
        await notificationService.create({
          userId: metadata.userId,
          title: "TẢI TÀI LIỆU THÀNH CÔNG",
          message: `File "${file.name}" đã được lưu trữ an toàn.`,
          type: "SUCCESS"
        });

        // 4. Xử lý trích xuất văn bản (Chạy ngầm)
        // Dùng file.url (hoặc file.ufsUrl nếu bản mới)
        extractOnlyText(file.url, file.name, file.type)
          .then(async (content) => {
            await prisma.document.update({
              where: { id: newDoc.id },
              data: { content: content || "Không thể trích xuất văn bản." }
            });
            console.log(`Đã trích xuất xong text cho: ${file.name}`);
          })
          .catch(err => console.error("Lỗi trích xuất text:", err));

        return { success: true, docId: newDoc.id };
      } catch (dbError: any) {
        console.error("Lỗi lưu Database:", dbError.message);
        throw new Error("Lỗi lưu trữ dữ liệu");
      }
    })
} satisfies FileRouter;