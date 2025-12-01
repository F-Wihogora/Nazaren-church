import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // In production, use JWT or NextAuth session
    return NextResponse.json(
      {
        message: "Login successful",
        admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

