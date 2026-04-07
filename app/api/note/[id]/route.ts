import { NextRequest, NextResponse } from "next/server";
import { noteController } from "@/lib/api/controller/NoteController";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return noteController.updateNote(req);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return noteController.deleteNote(req, parseInt(id));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
