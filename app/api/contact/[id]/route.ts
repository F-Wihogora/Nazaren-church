import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Contact from "@/models/Contact";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json({ message: "Message deleted" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to delete message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
