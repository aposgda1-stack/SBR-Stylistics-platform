import dbConnect from "@/lib/mongodb";
import { UserProgress } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Delete users with name 'Student' and points 12450 (the fake ones)
    const result = await UserProgress.deleteMany({
      $or: [
        { name: 'Student' },
        { totalPoints: 12450 }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} fake entries.` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
