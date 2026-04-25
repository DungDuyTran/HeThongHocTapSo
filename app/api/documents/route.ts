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
    const userIdStr = req.headers.get("x-user-id");
    let userName = req.headers.get("x-user-name") || "Học viên";

    if (!userIdStr)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const userId = parseInt(userIdStr);

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 400 },
      );
    }

    const { userName: nameInBody, ...docData } = body;
    if (userName === "Học viên" && nameInBody) userName = nameInBody;

    // 1. Tạo Document
    const newDoc = await service.createDoc({
      ...docData,
      userId: userId,
    });

    // 2. Ghi Audit Log (Đưa ra ngoài if hoặc bọc try-catch riêng để chắc chắn chạy)
    if (newDoc) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: userId,
            userName: userName,
            action: "TẢI TÀI LIỆU",
            table: "DOCUMENT",
            detail: `Đã tải lên tài liệu mới: ${newDoc.title}`,
            type: "DOCUMENT",
          },
        });
        console.log("ĐÃ GHI AUDIT LOG TẢI FILE!");
      } catch (e) {
        console.error("Lỗi ghi log nhưng vẫn cho upload tiếp:", e);
      }
    }
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi POST Documents:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
