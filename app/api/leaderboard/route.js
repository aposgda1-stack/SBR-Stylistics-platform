import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    const leaders = await UserProgress.find({})
      .sort({ totalPoints: -1 })
      .limit(10)
      .select('name totalPoints badges');

    const formattedLeaders = leaders.map((u, i) => ({
      id: u._id,
      name: u.name,
      points: u.totalPoints,
      rank: i + 1,
      badge: u.totalPoints >= 10000 ? 'vanguard'
           : u.totalPoints >= 5000  ? 'analyst'
           : u.totalPoints >= 2000  ? 'thinker'
           : 'scholar'
    }));

    return NextResponse.json({ success: true, leaders: formattedLeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
