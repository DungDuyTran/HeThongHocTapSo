import { Todo } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class TodoRepository {
  // Lấy Todo trong một khoảng ngày cụ thể của một học viên
  async findByDateRange(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<Todo[]> {
    return await prisma.todo.findMany({
      where: {
        hocVienId: userId,
        targetDate: { gte: start, lte: end },
      },
      orderBy: { targetDate: "asc" },
    });
  }
}
