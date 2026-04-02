import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Mở gói params trước
    const { id } = await params; 
    const docId = Number(id);

    if (isNaN(docId)) {
      return NextResponse.json({ error: "ID tài liệu không hợp lệ" }, { status: 400 });
    }

    // 2. Lấy Body để có userId của người xóa
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    const { userId } = body;

    // 3. Tìm tài liệu và Tên người dùng cùng lúc (Dùng Promise.all cho nhanh)
    const [doc, userRecord] = await Promise.all([
      prisma.document.findUnique({ where: { id: docId } }),
      userId ? prisma.user.findUnique({ 
        where: { id: Number(userId) },
        select: { hoTen: true } 
      }) : Promise.resolve(null)
    ]);

    if (!doc) {
      return NextResponse.json({ error: "Tài liệu không thấy đâu cả!" }, { status: 404 });
    }

    // 4. Tiến hành xóa
    await prisma.document.delete({ 
      where: { id: docId } 
    });

    // 5. Ghi log với Tên thật lấy từ Database (userRecord.hoTen)
    await prisma.auditLog.create({
      data: {
        userId: userId ? Number(userId) : null,
        userName: userRecord?.hoTen || "Học viên", 
        action: "XÓA TÀI LIỆU",
        table: "document",
        detail: `Đã xóa tài liệu: ${doc.title}`,
        type: "DANGER"
      }
    });

    return NextResponse.json({ message: "Xóa thành công" });

  } catch (error: any) {
    console.error("Lỗi xóa tài liệu:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}