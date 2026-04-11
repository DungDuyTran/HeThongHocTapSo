import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    // Đếm tổng học viên & tài liệu
    const totalUsers = await prisma.user.count({
      where: { vaiTro: "HocVien" }
    });
    const totalDocs = await prisma.document.count();
    // Đếm học viên mới đăng ký trong ngày hôm nay
    const activeToday = await prisma.user.count({
      where: {
        vaiTro: "HocVien", 
        ngayTao: { gte: startOfToday }
      }
    });
    
    const latestActivities = await prisma.auditLog.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }
    });

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
    const topActiveUsers = await prisma.auditLog.groupBy({
      by: ['userId'],
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 5,
    });
    const leaderboardData = await Promise.all(
      topActiveUsers
        .filter(item => item.userId !== null) 
        .map(async (item) => {
        const user = await prisma.user.findUnique({
        where: { id: item.userId as number }, 
        select: { hoTen: true },
      });
      
      return {
        id: item.userId,
        name: user?.hoTen || `Học viên ${item.userId}`,
        activities: item._count.userId,
      };
    })
)

    return NextResponse.json({
      totalUsers,
      totalDocs,
      activeToday,
      aiResponseRate: 99.9, 
      chartData,
      latestActivities,
      leaderboardData
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    return NextResponse.json({ error: "Lỗi lấy thống kê" }, { status: 500 });
  }
}