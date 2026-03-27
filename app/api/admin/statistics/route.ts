import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalDocs = await prisma.document.count();
    
    const activeToday = await prisma.user.count({
      where: {
        ngayTao: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    });
    const now = new Date();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = `Tháng ${d.getMonth() + 1}`;
      
      const count = await prisma.user.count({
        where: {
          ngayTao: {
            lt: new Date(d.getFullYear(), d.getMonth() + 1, 1),
          }
        }
      });
      chartData.push({ name: monthName, users: count });
    }

    return NextResponse.json({
      totalUsers,
      totalDocs,
      activeToday,
      aiResponseRate: 99.9, 
      chartData 
    });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy thống kê" }, { status: 500 });
  }
}