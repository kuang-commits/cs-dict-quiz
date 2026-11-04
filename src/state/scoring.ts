import type { Persisted, QuestionType } from '@/types';

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const HEARTS_PER_DAY = 5;
export const DAILY_GOALS = [10, 20, 30, 50] as const;
export type DailyGoal = (typeof DAILY_GOALS)[number];
export const PERFECT_BONUS = 30;
export const CODING_PASS_XP = 40;
export const EXAM_PASS_LINE = 90;

export function questionXp(type: QuestionType): number {
  if (type === 'fill-in') return 20;
  if (type === 'zh-to-en') return 15;
  return 10;
}

/** Consecutive correct answers in this lesson, including the one just scored. */
export function streakBonus(sessionStreak: number): number {
  if (sessionStreak <= 1) return 0;
  return Math.min(10, (sessionStreak - 1) * 2);
}

export function answerXp(type: QuestionType, correct: boolean, sessionStreak: number): number {
  if (!correct) return 0;
  return questionXp(type) + streakBonus(sessionStreak);
}

export function starsFor(accuracyPercent: number): 0 | 1 | 2 | 3 {
  if (accuracyPercent >= 100) return 3;
  if (accuracyPercent >= 80) return 2;
  if (accuracyPercent >= 60) return 1;
  return 0;
}

export function levelFromXp(totalXp: number): { level: number; current: number; span: number } {
  const level = Math.floor(totalXp / 100) + 1;
  return { level, current: totalXp % 100, span: 100 };
}

export function weekKey(date: Date): string {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + 3 - ((copy.getDay() + 6) % 7));
  const week1 = new Date(copy.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((copy.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    );
  return `${copy.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

export type Achievement = {
  id: string;
  name: string;
  detail: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', name: '第一课', detail: '完成一次章节练习' },
  { id: 'streak-7', name: '一周不断', detail: '连续学习达到 7 天' },
  { id: 'terms-100', name: '百词斩', detail: '掌握 100 个术语' },
  { id: 'coding-10', name: '代码十题', detail: '通过 10 道编程题' },
];

export function earnedAchievements(data: Persisted): string[] {
  const earned = new Set(data.achievements);
  if (data.lessonsCompleted >= 1) earned.add('first-lesson');
  if (data.streak >= 7) earned.add('streak-7');
  if (data.learnedTermIds.length >= 100) earned.add('terms-100');
  if (data.codingSolved.length >= 10) earned.add('coding-10');
  return [...earned];
}

export function withDailyReset(prev: Persisted, now = new Date()): Persisted {
  const today = dateKey(now);
  const week = weekKey(now);
  return {
    ...prev,
    hearts: prev.heartsDate === today ? prev.hearts : HEARTS_PER_DAY,
    heartsDate: today,
    todayXp: prev.todayKey === today ? prev.todayXp : 0,
    todayKey: today,
    weeklyXp: prev.weekKey === week ? prev.weeklyXp : 0,
    weekKey: week,
  };
}

export function addXp(prev: Persisted, amount: number, now = new Date()): Persisted {
  if (amount <= 0) return withDailyReset(prev, now);
  const base = withDailyReset(prev, now);
  const next = {
    ...base,
    totalXp: base.totalXp + amount,
    todayXp: base.todayXp + amount,
    weeklyXp: base.weeklyXp + amount,
  };
  return { ...next, achievements: earnedAchievements(next) };
}

export const SAMPLE_RIVALS = [
  { name: '示例 · 小林', weeklyXp: 80 },
  { name: '示例 · 阿宁', weeklyXp: 45 },
  { name: '示例 · 周周', weeklyXp: 20 },
];
