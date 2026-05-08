export const getRank = (points) => {
  if (points >= 10000) return { title: 'Vanguard', color: 'text-secondary', icon: 'workspace_premium', badge: 'vanguard' };
  if (points >= 5000)  return { title: 'Lead Analyst', color: 'text-emerald-500', icon: 'query_stats', badge: 'analyst' };
  if (points >= 2000)  return { title: 'Flash Thinker', color: 'text-blue-400', icon: 'bolt', badge: 'thinker' };
  return                      { title: 'SBR Scholar', color: 'text-orange-400', icon: 'school', badge: 'scholar' };
};
