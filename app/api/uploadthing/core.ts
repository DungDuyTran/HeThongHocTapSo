import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    blob: { maxFileSize: "16MB" }, // Blob dùng cho Word, Excel, PPT
  }).middleware(async ({ req }) => {
      // Tạm thời lấy ID từ một nguồn nào đó hoặc để cứng để test
      // Nếu bro dùng Clerk hay Auth.js thì lấy ở đây
      return { userId: 2 }; 
    })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload hoàn tất. URL file tại Cloud:", file.url);
    const fileUrl = file.url;
    const fileName = file.name;
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
