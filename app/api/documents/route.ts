import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/lib/api/service/DocumentService";
import prisma from "@/lib/prisma";
import { notificationService } from "@/lib/notification-service";

const service = new DocumentService();

export async function GET(req: NextRequest) {
  try {
    const userIdStr = req.headers.get("x-user-id");
    if (!userIdStr)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const docs = await service.getDocs(parseInt(userIdStr));
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Lấy thông tin từ Header 
    const userIdStr = req.headers.get("x-user-id");
    let userName = req.headers.get("x-user-name") || "Học viên";

    if (!userIdStr)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const userId = parseInt(userIdStr);

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      console.error("LỖI: User ID này không tồn tại trong DB!");
      return NextResponse.json({ error: "Người dùng không tồn tại trong hệ thống mới" }, { status: 400 });
    }

    const { userName: nameInBody, ...docData } = body;

    // Nếu header không có tên mà body có (từ useAxios), thì lấy từ body
    if (userName === "Học viên" && nameInBody) {
      userName = nameInBody;
    }

    const newDoc = await service.createDoc({
      ...docData, // Dùng docData đã lọc, không còn userName thừa
      userId: userId,
    });

    // Ghi Audit Log 
    if (newDoc) {
      console.log("Lưu DB thành công file:", newDoc.title);
      await prisma.auditLog.create({
        data: {
          userId: userId,
          userName: userName, 
          action: "TẢI TÀI LIỆU",
          table: "DOCUMENT",
          detail: `Đã tải lên tài liệu mới: ${newDoc.title}`,
          type: "SUCCESS", 
        },
      });

      await notificationService.create({
        userId,
        title: "TẢI TÀI LIỆU THÀNH CÔNG",
        message: `Tài liệu "${newDoc.title}" đã được lưu trữ. Bạn có thể nhờ Smart Study AI tóm tắt file này rồi đó! 📄`,
        type: "SUCCESS",
      });
    }

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi POST Documents:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
