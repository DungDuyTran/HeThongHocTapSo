import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  try {
    const dateFilter = startDate && endDate ? {
      gte: new Date(startDate),
      lte: new Date(endDate),
    } : undefined;

    const [users, docs, folders] = await Promise.all([
      prisma.user.findMany({
        where: {
          vaiTro: "HocVien", 
          ...(dateFilter ? { ngayTao: dateFilter } : {}),
        },
      }),
      prisma.document.findMany({
        where: dateFilter ? { createdAt: dateFilter } : {},
      }),
      prisma.flashcardFolder.findMany({
        where: dateFilter ? { createdAt: dateFilter } : {},
      }),
    ]);

    return NextResponse.json({
      summary: {
        newUsers: users.length,
        newDocs: docs.length,
        newFolders: folders.length,
      },
      details: {
        users: users.map(u => ({
          "Tên": u.hoTen,
          "Email": u.email,
          "Vai trò": u.vaiTro,
          "Ngày tham gia": u.ngayTao ? new Date(u.ngayTao).toLocaleDateString('vi-VN') : "N/A"
        })),
        documents: docs.map(d => ({
          "id": d.id,
          "Tên tài liệu": d.title,
          "Loại file": d.fileType,
          "Kích thước": d.fileSize,
          "Ngày tải lên": new Date(d.createdAt).toLocaleDateString('vi-VN'),
          "url": d.fileUrl
        })),
        flashcards: folders.map(f => ({
          "id": f.id,
          "Tên bộ thẻ": f.name, 
          "Ngày tạo": new Date(f.createdAt).toLocaleDateString('vi-VN')
        }))
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi báo cáo" }, { status: 500 });
  }
}