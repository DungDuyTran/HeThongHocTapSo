import { NextResponse } from "next/server";
import { StatisticsService } from "@/lib/api/service/StatisticsService";

const statsService = new StatisticsService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type =
      (searchParams.get("type") as "week" | "month" | "year") || "week";
    const userId = parseInt(req.headers.get("x-user-id") || "1"); // Tạm fix là 1 để test

    const data = await statsService.getTodoStats(userId, type);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
