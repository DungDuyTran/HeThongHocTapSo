import { NextResponse } from "next/server";
import { TodoService } from "@/lib/api/service/TodoService";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // Lấy ID từ URL
    const body = await req.json();
    const userId = parseInt(req.headers.get("x-user-id") || "0");

    const updated = await TodoService.saveTodo(userId, { ...body, id });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await TodoService.deleteTodo(parseInt(id));

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
