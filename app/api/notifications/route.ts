import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 5; 
    const skip = (page - 1) * limit;

    const userIdHeader = req.headers.get("x-user-id");
    const userId = userIdHeader ? parseInt(userIdHeader) : null;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [unreadCount, total, notifications] = await Promise.all([
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      })
    ]);

    return NextResponse.json({
      data: notifications,
      unreadCount: unreadCount,
      totalPages: Math.ceil(total / limit),
      total: total
    });

  } catch (error: any) {
    console.error("LỖI GET NOTIFICATIONS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}