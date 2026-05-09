import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import { NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(req) {
  // Secure this route with a secret token
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Delete users with placeholder data only
    const result = await UserProgress.deleteMany({
      $and: [
        { name: 'Student' },
        { totalPoints: 0 },
        { quizScores: { $size: 0 } }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} placeholder entries.` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

