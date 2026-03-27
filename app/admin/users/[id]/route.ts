import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { vaiTro } = await req.json();
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { vaiTro }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi cập nhật" }, { status: 500 });
  }
}