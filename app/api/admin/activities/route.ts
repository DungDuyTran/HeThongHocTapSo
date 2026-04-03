import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.toLowerCase();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const dateFilter = start && end ? {
      gte: new Date(start),
      lte: new Date(end),
    } : undefined;

    // Lấy trực tiếp từ bảng AuditLog 
    const logs = await prisma.auditLog.findMany({
      where: {
        ...(dateFilter ? { createdAt: dateFilter } : {}),
        ...(name ? { 
          OR: [
            { userName: { contains: name } },
            { detail: { contains: name } }
          ]
        } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 50 
    });

    // Format lại dữ liệu cho Frontend dễ hiển thị
    const activities = logs.map(log => ({
      id: log.id,
      userName: log.userName || "Hệ thống",
      action: log.action,
      detail: log.detail,
      time: log.createdAt,
      type: log.type, // DANGER, SUCCESS, INFO, WARNING
      table: log.table
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Lỗi lấy AuditLog:", error);
    return NextResponse.json({ error: "Lỗi lấy nhật ký hoạt động" }, { status: 500 });
  }
}