export const getRank = (points) => {
  if (points >= 15000) return { title: 'Master of Rhetoric', color: 'text-purple-400', icon: 'auto_awesome' };
  if (points >= 10000) return { title: 'Stylistic Analyst', color: 'text-secondary', icon: 'analytics' };
  if (points >= 5000) return { title: 'Linguistic Expert', color: 'text-blue-400', icon: 'psychology' };
  if (points >= 1000) return { title: 'SBR Student', color: 'text-emerald-400', icon: 'school' };
  return { title: 'Linguistic Novice', color: 'text-slate-500', icon: 'menu_book' };
};
