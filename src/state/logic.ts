import type { AnswerMode, AnswerResult, ExamResult, Persisted, Question } from '@/types';

export const WRONG_RETRIES_TO_CLEAR = 2;

export function emptyProgress(): Persisted {
  return {
    version: 1,
    favorites: [],
    learnedTermIds: [],
    seenQuestionIds: [],
    answered: 0,
    correct: 0,
    streak: 0,
    lastActiveDate: null,
    wrongs: {},
    lastExam: null,
  };
}

export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function normalizeProgress(raw: unknown): Persisted {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const value = raw as Partial<Persisted>;
  if (value.version !== 1) return base;
  return {
    ...base,
    favorites: stringList(value.favorites),
    learnedTermIds: stringList(value.learnedTermIds),
    seenQuestionIds: stringList(value.seenQuestionIds),
    answered: numberOr(value.answered, 0),
    correct: numberOr(value.correct, 0),
    streak: numberOr(value.streak, 0),
    lastActiveDate: typeof value.lastActiveDate === 'string' ? value.lastActiveDate : null,
    wrongs: value.wrongs && typeof value.wrongs === 'object' ? value.wrongs : {},
    lastExam: value.lastExam ?? null,
  };
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function withStreak(prev: Persisted, now: Date): Pick<Persisted, 'streak' | 'lastActiveDate'> {
  const today = dateKey(now);
  if (prev.lastActiveDate === today) {
    return { streak: Math.max(prev.streak, 1), lastActiveDate: today };
  }
  const yesterday = dateKey(shiftDays(now, -1));
  return {
    streak: prev.lastActiveDate === yesterday ? prev.streak + 1 : 1,
    lastActiveDate: today,
  };
}

export function applyAnswer(
  prev: Persisted,
  question: Question,
  chosen: number,
  mode: AnswerMode,
  now = new Date(),
): { state: Persisted; result: AnswerResult } {
  const isCorrect = chosen === question.answerIndex;
  const wrongs = { ...prev.wrongs };
  let removed = false;

  if (!isCorrect) {
    wrongs[question.id] = { correctRetries: 0, updatedAt: now.getTime() };
  } else if (mode === 'wrong' && wrongs[question.id]) {
    const nextRetries = wrongs[question.id].correctRetries + 1;
    if (nextRetries >= WRONG_RETRIES_TO_CLEAR) {
      delete wrongs[question.id];
      removed = true;
    } else {
      wrongs[question.id] = { correctRetries: nextRetries, updatedAt: now.getTime() };
    }
  }

  const learned = new Set(prev.learnedTermIds);
  if (isCorrect) learned.add(question.termId);
  const seen = new Set(prev.seenQuestionIds);
  seen.add(question.id);

  const state: Persisted = {
    ...prev,
    ...withStreak(prev, now),
    wrongs,
    learnedTermIds: [...learned],
    seenQuestionIds: [...seen],
    answered: prev.answered + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
  };

  return {
    state,
    result: {
      isCorrect,
      correctRetries: state.wrongs[question.id]?.correctRetries ?? (removed ? WRONG_RETRIES_TO_CLEAR : 0),
      removed,
    },
  };
}

export function toggleFavorite(prev: Persisted, termId: string): Persisted {
  const exists = prev.favorites.includes(termId);
  return {
    ...prev,
    favorites: exists ? prev.favorites.filter((id) => id !== termId) : [...prev.favorites, termId],
  };
}

export function examPoints(exam: Pick<ExamResult, 'correct' | 'total'>): number {
  if (exam.total <= 0) return 0;
  return Math.round((exam.correct / exam.total) * 100);
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
