import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch ALL users sorted by points
    const allUsers = await UserProgress.find({})
      .sort({ totalPoints: -1 })
      .select('name totalPoints email updatedAt questionsSolved chapterProgress');

    const stats = {
      totalUsers: allUsers.length,
      averagePoints: allUsers.length > 0 
        ? Math.round(allUsers.reduce((acc, u) => acc + (u.totalPoints || 0), 0) / allUsers.length) 
        : 0,
      users: allUsers.map(u => ({
        name: u.name,
        points: u.totalPoints,
        email: u.email,
        solved: u.questionsSolved,
        lastActive: u.updatedAt
      }))
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
