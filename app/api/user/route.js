import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress } from '@/lib/models';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { userId, name, totalPoints, activity, mistakes } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const update = {
      name,
      totalPoints,
      recentActivity: activity,
      updatedAt: new Date()
    };

    const user = await UserProgress.findOneAndUpdate(
      { userId },
      update,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Sync error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await UserProgress.findOne({ userId });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
