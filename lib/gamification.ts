import { db } from "./db";

export interface Badge {
  id: string;
  title: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: "first_step", title: "Premier pas", description: "Faire ton premier quiz" },
  { id: "streak_7", title: "Sérotonine", description: "7 jours de streak" },
  { id: "master_quiz", title: "Maître des Quiz", description: "Score parfait dans un quiz" },
];

export async function updateStats() {
  const now = Date.now();
  let stats = await db.userStats.toCollection().first();

  if (!stats) {
    stats = { lastActive: now, streak: 1, xp: 0, badges: [] };
    await db.userStats.add(stats);
    return stats;
  }

  const diffDays = Math.floor((now - stats.lastActive) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    stats.streak += 1;
  } else if (diffDays > 1) {
    stats.streak = 1;
  }

  stats.lastActive = now;
  await db.userStats.update(stats.id!, stats);
  return stats;
}

export async function addXp(amount: number) {
  const stats = await updateStats();
  stats.xp += amount;
  await db.userStats.update(stats.id!, { xp: stats.xp });
}

export async function unlockBadge(badgeId: string) {
  const stats = await db.userStats.toCollection().first();
  if (stats && !stats.badges.includes(badgeId)) {
    stats.badges.push(badgeId);
    await db.userStats.update(stats.id!, { badges: stats.badges });
  }
}
