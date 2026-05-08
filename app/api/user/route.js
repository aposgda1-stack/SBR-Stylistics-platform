import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress } from '@/lib/models';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { userId, name, scoreUpdate, quizResult, mistakes, activity } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let user = await UserProgress.findOne({ userId });
    
    if (!user) {
      user = new UserProgress({ userId, email: data.email || 'student@stylistics.com', name: name || 'Student' });
    }

    // Update basic info
    if (name) user.name = name;
    if (mistakes) user.mistakes = mistakes;
    if (activity) user.activity = { ...user.activity, ...activity };

    // Handle Quiz Submission
    if (quizResult) {
      const { quizId, score, totalQuestions } = quizResult;
      
      // Add to quiz scores
      user.quizScores.push({
        quizId,
        score,
        totalQuestions,
        timestamp: new Date()
      });

      // Update points (10 points per correct answer)
      const pointsEarned = score * 10;
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

    // Manual totalPoints sync (fallback)
    if (scoreUpdate !== undefined) {
      user.totalPoints = scoreUpdate;
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

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await UserProgress.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate Stats for Dashboard
    const totalQuizzes = user.quizScores.length;
    let totalCorrect = 0;
    let totalPossible = 0;
    
    user.quizScores.forEach(q => {
      totalCorrect += q.score;
      totalPossible += q.totalQuestions;
    });

    const accuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;
    
    // Assume there are 12 chapters in total for progress calculation
    const progress = Math.min(100, Math.round((user.chapterProgress.size / 12) * 100));

    return NextResponse.json({ 
      user, 
      stats: {
        accuracy,
        progress,
        totalQuizzes,
        rank: user.totalPoints > 10000 ? 'LEGEND' : user.totalPoints > 5000 ? 'VANGUARD' : user.totalPoints > 2000 ? 'SCHOLAR' : 'NOVICE'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

