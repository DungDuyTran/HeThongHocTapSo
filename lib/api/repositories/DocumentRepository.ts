import { prisma } from "@/lib/prisma";
import { BaseRepository, PrismaDelegate } from "../base/BaseRepository";
import { Document } from "@prisma/client";

export class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super(prisma.document as unknown as PrismaDelegate<Document>);
  }

async findByUserId(userId: number): Promise<Document[]> {
  console.log("ĐANG TRUY VẤN TÀI LIỆU CHO USER ID:", userId);
  const result = await (this.model as any).findMany({
    where: { 
      userId: Number(userId) 
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(`Tìm thấy ${result.length} kết quả.`);
  return result;
}
async create(data: any): Promise<Document> {
  console.log("Dữ liệu nhận vào:", data);

  const newDoc = await prisma.document.create({
    data: {
      title: data.title,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      userId: Number(data.userId) 
    }
  });
  return newDoc;
}
  async delete(id: number) {
    return (this.model as any).delete({
      where: { id: Number(id) },
    });
  }
}
