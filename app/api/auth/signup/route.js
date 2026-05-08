import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await UserProgress.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "user_" + Math.random().toString(36).substr(2, 9);

    const newUser = await UserProgress.create({
      userId,
      name,
      email,
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
