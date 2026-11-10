import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import MemberCredential from "@/models/MemberCredential";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { suggestDivision } from "@/lib/church-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Name Handling (First name + Last name preferred)
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    let fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    }

    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        { error: "Please provide a valid first and last name." },
        { status: 400 }
      );
    }

    // 2. Email Validation
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 3. Password Validation & Matching
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // 4. Date of Birth Validation (Mandatory for Church Records & Birthdays)
    if (!body.birthday && !body.dateOfBirth) {
      return NextResponse.json(
        { error: "Date of birth is required for church membership records." },
        { status: 400 }
      );
    }

    const rawBirthday = body.birthday || body.dateOfBirth;
    const birthday = new Date(rawBirthday);
    if (isNaN(birthday.getTime()) || birthday > new Date()) {
      return NextResponse.json(
        { error: "Please provide a valid past date of birth." },
        { status: 400 }
      );
    }

    // Optional Fields
    const phone = typeof body.phone === "string" && body.phone.trim().length > 0 ? body.phone.trim() : undefined;
    const address = typeof body.address === "string" && body.address.trim().length > 0 ? body.address.trim() : undefined;
    const gender = ["Male", "Female", "Other"].includes(body.gender) ? body.gender : "Other";

    await connectDB();

    // Check if account already exists
    if (await MemberCredential.exists({ email })) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in." },
        { status: 409 }
      );
    }

    // Link existing member if record was created previously by church office
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      const name = existingMember.fullName;
      if (phone && !existingMember.phone) existingMember.phone = phone;
      if (address && !existingMember.address) existingMember.address = address;
      if (birthday && !existingMember.birthday) existingMember.birthday = birthday;
      if (gender && existingMember.gender === "Other") existingMember.gender = gender;
      await existingMember.save();

      await MemberCredential.create({
        member: existingMember._id,
        email,
        passwordHash: await bcrypt.hash(password, 12),
      });

      const response = NextResponse.json(
        {
          user: { name, email, role: "member" },
          message: "Your church membership record was successfully connected.",
        },
        { status: 201 }
      );
      setSessionCookie(
        response,
        createSessionToken({ sub: String(existingMember._id), email, name, role: "member" })
      );
      return response;
    }

    // Create fresh member record
    const division = suggestDivision(birthday, gender);
    const member = await Member.create({
      fullName,
      email,
      phone,
      address,
      gender,
      birthday,
      division,
      role: "Member",
      churchRoles: [{ role: "Member", status: "active", assignedAt: new Date() }],
      dateJoined: new Date(),
    });

    try {
      await MemberCredential.create({
        member: member._id,
        email,
        passwordHash: await bcrypt.hash(password, 12),
      });

      const response = NextResponse.json(
        { user: { name: fullName, email, role: "member" } },
        { status: 201 }
      );
      setSessionCookie(
        response,
        createSessionToken({ sub: String(member._id), email, name: fullName, role: "member" })
      );
      return response;
    } catch (error) {
      await Member.findByIdAndDelete(member._id);
      throw error;
    }
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create your account right now. Please try again." },
      { status: 500 }
    );
  }
}
