import { prisma } from "@/lib/prisma";

export class FlashcardRepository {
  // Lấy lịch sử làm bài của User, kèm tên Folder để hiển thị
  async getHistory(userId: number) {
    return await prisma.flashcardHistory.findMany({
      where: { userId },
      include: {
        folder: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" }, // Mới nhất hiện lên đầu
    });
  }
}
