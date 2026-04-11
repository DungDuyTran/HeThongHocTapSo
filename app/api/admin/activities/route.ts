import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const type = searchParams.get("type")?.toUpperCase();
  let name = searchParams.get("name");
  if (name) {
    name = name.normalize("NFC").trim(); 
  }

  try {
    const andConditions: any[] = [];

    // 1. Lọc theo ngày
    if (start && end) {
      andConditions.push({
        createdAt: {
          gte: new Date(new Date(start).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(end).setHours(23, 59, 59, 999)),
        }
      });
    }

    // 2. Lọc theo Tên hoặc Chi tiết (XÓA mode: 'insensitive' để hết lỗi 500)
    if (name) {
      andConditions.push({
        OR: [
          { userName: { contains: name } }, 
          { detail: { contains: name } }
        ]
      });
    }

    // 3. Lọc theo Thể loại (Gộp DOCUMENT và FILE vào cùng type filter)
    if (type && type !== "ALL") {
      if (type === "DOCUMENT") {
        andConditions.push({
          OR: [
            { type: "DOCUMENT" },
            { type: "FILE" },
            { table: "document" }
          ]
        });
      } else {
        // Đảm bảo so khớp chính xác Type
        andConditions.push({
          type: { equals: type } 
        });
      }
    }

    // 4. Truy vấn
    const logs = await prisma.auditLog.findMany({
      // Dùng logic AND để kết hợp Tên + Thể loại
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      orderBy: { createdAt: 'desc' },
      take: 100 
    });
    
    const activities = logs.map(log => ({
      id: log.id,
      userName: log.userName || "Hệ thống",
      action: log.action,
      detail: log.detail,
      time: log.createdAt,
      type: log.type,
      table: log.table
    }));

    return NextResponse.json(activities);
  } catch (error: any) {
    // Log lỗi chi tiết ra console để bro debug nếu còn lỗi
    console.error("❌ LỖI PRISMA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}