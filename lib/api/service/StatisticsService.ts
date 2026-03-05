import { TodoRepository } from "../repositories/TodoRepository";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  eachMonthOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";

export class StatisticsService {
  private todoRepo: TodoRepository;

  constructor() {
    this.todoRepo = new TodoRepository();
  }

  async getTodoStats(userId: number, type: "week" | "month" | "year") {
    const now = new Date();
    let start: Date, end: Date;

    // Xác định phạm vi thời gian dựa trên filter
    if (type === "week") {
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (type === "month") {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }

    const todos = await this.todoRepo.findByDateRange(userId, start, end);

    // Chế độ xem theo năm: Nhóm theo Tháng
    if (type === "year") {
      const months = eachMonthOfInterval({ start, end });
      return months.map((m) => {
        const monthTodos = todos.filter((t) =>
          isSameMonth(new Date(t.targetDate), m),
        );
        const completed = monthTodos.filter((t) => t.status).length;
        const total = monthTodos.length;
        return {
          name: format(m, "MMM"), // "Jan", "Feb"...
          completed,
          uncompleted: total - completed,
          total,
          rateCompleted: total > 0 ? Math.round((completed / total) * 100) : 0,
          rateUncompleted:
            total > 0 ? Math.round(((total - completed) / total) * 100) : 100,
        };
      });
    }

    // Chế độ xem theo tuần/tháng: Nhóm theo Ngày
    const days = eachDayOfInterval({ start, end });
    return days.map((d) => {
      const dayTodos = todos.filter((t) =>
        isSameDay(new Date(t.targetDate), d),
      );
      const completed = dayTodos.filter((t) => t.status).length;
      const total = dayTodos.length;
      return {
        name: format(d, "dd/MM"), // "02/03", "03/03"...
        completed,
        uncompleted: total - completed,
        total,
        // Tính tỷ lệ cho biểu đồ 100%
        rateCompleted: total > 0 ? Math.round((completed / total) * 100) : 0,
        rateUncompleted:
          total > 0 ? Math.round(((total - completed) / total) * 100) : 100,
      };
    });
  }
}
