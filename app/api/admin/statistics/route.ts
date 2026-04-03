import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Chỉ đếm những người có vai trò là Học Viên
    const totalUsers = await prisma.user.count({
      where: { vaiTro: "HocVien" }
    });

    const totalDocs = await prisma.document.count();
    
    // 2. Đếm học viên mới đăng ký trong ngày hôm nay
    const activeToday = await prisma.user.count({
      where: {
        vaiTro: "HocVien", 
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
          vaiTro: "HocVien", 
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
    console.error("Lỗi lấy thống kê:", error);
    return NextResponse.json({ error: "Lỗi lấy thống kê" }, { status: 500 });
  }
}