'use client';

/**
 * Global utility to sync user progress to MongoDB.
 * Handles points, mistakes, and activity.
 */
export async function syncToCloud(update) {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('stylistics_user_id') : null;
  if (!userId) return;

  try {
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...update
      })
    });
    const data = await res.json();
    if (data.success) {
      console.log('Cloud sync successful');
      return data.user;
    }
  } catch (err) {
    console.error('Cloud sync failed:', err);
  }
}

/**
 * Reconciles local storage with cloud data on session start.
 */
export async function reconcileData() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('stylistics_user_id') : null;
  if (!userId) return;

  try {
    const res = await fetch(`/api/user?userId=${userId}`);
    const data = await res.json();
    if (data.user) {
      // Sync total points
      const localProgress = JSON.parse(localStorage.getItem('stylistics_user_progress') || '{"totalPoints": 0}');
      if (data.user.totalPoints > localProgress.totalPoints) {
        localProgress.totalPoints = data.user.totalPoints;
        localStorage.setItem('stylistics_user_progress', JSON.stringify(localProgress));
        window.dispatchEvent(new Event('stylistics_points_updated'));
      }
      
      // Sync mistakes
      if (data.user.mistakes && data.user.mistakes.length > 0) {
        localStorage.setItem('stylistics_mistakes', JSON.stringify(data.user.mistakes));
      }
    }
  } catch (err) {
    console.error('Data reconciliation failed:', err);
  }
}
