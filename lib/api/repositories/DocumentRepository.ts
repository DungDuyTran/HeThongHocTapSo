import { prisma } from "@/lib/prisma";
import { BaseRepository, PrismaDelegate } from "../base/BaseRepository";
import { Document } from "@prisma/client";

export class DocumentRepository extends BaseRepository<Document> {
  constructor() {
    super(prisma.document as unknown as PrismaDelegate<Document>);
  }

async findByUserId(userId: number): Promise<Document[]> {
  return (this.model as any).findMany({
    where: { 
      userId: Number(userId) 
    },
    orderBy: { createdAt: "desc" },
  });
}
async create(data: any): Promise<Document> {
  console.log(">>> [Repo] Dữ liệu nhận vào:", data);

  return this.model.create({
    data: {
      title: data.title,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      userId: Number(data.userId) 
    }
  });
}
  async delete(id: number) {
    return (this.model as any).delete({
      where: { id: Number(id) },
    });
  }
}
