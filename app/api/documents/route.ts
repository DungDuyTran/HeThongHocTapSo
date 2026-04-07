import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/lib/api/service/DocumentService";
import prisma from "@/lib/prisma";

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
    await prisma.auditLog.create({
      data: {
        userId: userId,
        userName: userName, 
        action: "TẢI TÀI LIỆU",
        table: "document",
        detail: `Đã tải lên tài liệu mới: ${newDoc.title}`,
        type: "SUCCESS", 
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi POST Documents:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
