import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress } from '@/lib/models';

// Maximum avatar size: 200KB in Base64 (~150KB raw image)
const MAX_AVATAR_SIZE_BYTES = 200 * 1024;

// Maximum reasonable points per quiz (100 questions * 10 pts)
const MAX_POINTS_PER_SYNC = 1000;

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { userId, name, scoreUpdate, quizResult, mistakes, activity, avatar } = data;

    if (!userId || typeof userId !== 'string' || userId.length > 64) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // Only allow updating existing users via POST (prevent creating ghost users)
    let user = await UserProgress.findOne({ userId });
    if (!user) {
      // Allow creating only if email is provided (comes from login flow)
      if (!data.email) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      user = new UserProgress({ userId, email: data.email, name: name || 'Student' });
    }

    // Update basic info
    if (name && typeof name === 'string') user.name = name.slice(0, 60);
    if (mistakes && Array.isArray(mistakes)) user.mistakes = mistakes.slice(0, 200);
    if (activity && typeof activity === 'object') user.activity = { ...user.activity, ...activity };
    
    // Validate avatar: reject if it's too large (prevents DB bloat)
    if (avatar) {
      const avatarSizeBytes = Buffer.byteLength(avatar, 'utf8');
      if (avatarSizeBytes <= MAX_AVATAR_SIZE_BYTES) {
        user.avatar = avatar;
      } else {
        console.warn(`Avatar rejected for user ${userId}: size ${avatarSizeBytes} bytes exceeds limit`);
      }
    }

    // Handle Quiz Submission
    if (quizResult) {
      const { quizId, score, totalQuestions } = quizResult;

      // Validate quiz result fields
      if (
        typeof quizId !== 'string' ||
        typeof score !== 'number' ||
        typeof totalQuestions !== 'number' ||
        score < 0 ||
        totalQuestions <= 0 ||
        score > totalQuestions
      ) {
        return NextResponse.json({ error: 'Invalid quiz result data' }, { status: 400 });
      }

      user.quizScores.push({
        quizId,
        score,
        totalQuestions,
        timestamp: new Date()
      });

      // Update points (10 points per correct answer)
      const pointsEarned = Math.min(score * 10, MAX_POINTS_PER_SYNC);
      user.totalPoints += pointsEarned;

      // Update chapter progress (store highest percentage)
      const percentage = Math.round((score / totalQuestions) * 100);
      const currentBest = user.chapterProgress.get(quizId) || 0;
      if (percentage > currentBest) {
        user.chapterProgress.set(quizId, percentage);
      }

      // Add to recent activity
      user.recentActivity.unshift({
        type: 'quiz_complete',
        title: quizId,
        score: `${score}/${totalQuestions}`,
        points: pointsEarned,
        timestamp: new Date()
      });

      // Limit recent activity size
      if (user.recentActivity.length > 10) user.recentActivity.pop();
    }

    // Manual totalPoints sync: only allow decreasing or small increases (anti-cheat)
    if (scoreUpdate !== undefined && typeof scoreUpdate === 'number') {
      // Only trust scoreUpdate if it's not dramatically higher than current
      if (scoreUpdate <= user.totalPoints + MAX_POINTS_PER_SYNC) {
        user.totalPoints = Math.max(0, scoreUpdate);
      }
    }

    user.updatedAt = new Date();
    await user.save();

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

    if (!userId || typeof userId !== 'string' || userId.length > 64) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const user = await UserProgress.findOne({ userId }).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate Stats for Dashboard
    const totalQuizzes = user.quizScores ? user.quizScores.length : 0;
    let totalCorrect = 0;
    let totalPossible = 0;
    
    if (user.quizScores) {
      user.quizScores.forEach(q => {
        totalCorrect += (q.score || 0);
        totalPossible += (q.totalQuestions || 0);
      });
    }

    const accuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;
    
    // Safety check for Map type
    const progressCount = user.chapterProgress instanceof Map
      ? user.chapterProgress.size
      : Object.keys(user.chapterProgress || {}).length;
    const progress = Math.min(100, Math.round((progressCount / 12) * 100));

    return NextResponse.json({ 
      user, 
      stats: {
        accuracy,
        progress,
        totalQuizzes,
        rank: (user.totalPoints || 0) > 10000 ? 'LEGEND'
            : (user.totalPoints || 0) > 5000  ? 'VANGUARD'
            : (user.totalPoints || 0) > 2000  ? 'SCHOLAR'
            : 'NOVICE'
      }
    });
  } catch (err) {
    console.error("API GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

