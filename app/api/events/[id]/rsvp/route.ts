import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Event from "@/models/Event";
import EventRsvp from "@/models/EventRsvp";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  try {
    await connectDB();
    const rsvps = await EventRsvp.find({ event: params.id }).sort({ createdAt: -1 });
    const totalGuests = rsvps.reduce((sum, r) => sum + (r.guests || 1), 0);
    return NextResponse.json({ rsvps, totalGuests }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to load RSVPs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (new Date(event.date) < new Date()) {
      return NextResponse.json({ error: "This event has already passed." }, { status: 400 });
    }
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const guests = Math.min(20, Math.max(1, parseInt(String(body.guests ?? 1), 10) || 1));
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Enter your name and a valid email." }, { status: 400 });
    }
    const rsvp = await EventRsvp.findOneAndUpdate(
      { event: params.id, email },
      { name, email, phone: phone || undefined, guests },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ rsvp }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to save RSVP.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
