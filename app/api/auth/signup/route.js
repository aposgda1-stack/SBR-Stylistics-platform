import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Validate field formats
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
      return NextResponse.json({ error: "Name must be between 2 and 60 characters" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email) || email.length > 120) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await UserProgress.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "user_" + Math.random().toString(36).substr(2, 9);

    const newUser = await UserProgress.create({
      userId,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      authSource: "custom",
      totalPoints: 0
    });

    return NextResponse.json({ 
      success: true, 
      user: { userId: newUser.userId, name: newUser.name, email: newUser.email } 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
