import type { AnswerMode, AnswerResult, ExamResult, Persisted, Question, ReviewRating, VocabCard } from '@/types';

export const WRONG_RETRIES_TO_CLEAR = 2;
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15] as const;
const HISTORY_LIMIT = 12;

export function emptyProgress(): Persisted {
  return {
    version: 2,
    vocab: {},
    searchHistory: [],
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

export function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function normalizeProgress(raw: unknown): Persisted {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const value = raw as {
    version?: number;
    favorites?: unknown;
    vocab?: Persisted['vocab'];
    searchHistory?: unknown;
    learnedTermIds?: unknown;
    seenQuestionIds?: unknown;
    answered?: unknown;
    correct?: unknown;
    streak?: unknown;
    lastActiveDate?: unknown;
    wrongs?: Persisted['wrongs'];
    lastExam?: Persisted['lastExam'];
  };
  if (value.version !== 1 && value.version !== 2) return base;
  const vocab = normalizeVocab(value.vocab);
  const today = dateKey(new Date());
  for (const id of stringList(value.favorites)) {
    if (!vocab[id]) vocab[id] = { addedAt: 0, stage: 0, due: today };
  }
  return {
    ...base,
    vocab,
    searchHistory: stringList(value.searchHistory).slice(0, HISTORY_LIMIT),
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

function normalizeVocab(value: unknown): Record<string, VocabCard> {
  if (!value || typeof value !== 'object') return {};
  const vocab: Record<string, VocabCard> = {};
  for (const [id, card] of Object.entries(value as Record<string, Partial<VocabCard>>)) {
    if (!card || typeof card !== 'object') continue;
    vocab[id] = {
      addedAt: numberOr(card.addedAt, 0),
      stage: numberOr(card.stage, 0),
      due: typeof card.due === 'string' ? card.due : dateKey(new Date()),
    };
  }
  return vocab;
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

export function toggleVocab(prev: Persisted, termId: string, now = new Date()): Persisted {
  if (prev.vocab[termId]) {
    const vocab = { ...prev.vocab };
    delete vocab[termId];
    return { ...prev, vocab };
  }
  return {
    ...prev,
    vocab: {
      ...prev.vocab,
      [termId]: { addedAt: now.getTime(), stage: 0, due: dateKey(now) },
    },
  };
}

export function rateVocab(prev: Persisted, termId: string, rating: ReviewRating, now = new Date()): Persisted {
  const card = prev.vocab[termId];
  if (!card) return prev;
  if (rating === 'forget') {
    return {
      ...prev,
      vocab: { ...prev.vocab, [termId]: { ...card, stage: 0, due: dateKey(now) } },
    };
  }
  if (rating === 'fuzzy') {
    return {
      ...prev,
      vocab: { ...prev.vocab, [termId]: { ...card, due: dateKey(shiftDays(now, 1)) } },
    };
  }
  const days = REVIEW_INTERVALS[Math.min(card.stage, REVIEW_INTERVALS.length - 1)];
  return {
    ...prev,
    vocab: {
      ...prev.vocab,
      [termId]: {
        ...card,
        stage: Math.min(card.stage + 1, REVIEW_INTERVALS.length),
        due: dateKey(shiftDays(now, days)),
      },
    },
  };
}

export function dueVocabIds(prev: Persisted, now = new Date()): string[] {
  const today = dateKey(now);
  return Object.entries(prev.vocab)
    .filter(([, card]) => card.due <= today)
    .sort((left, right) => left[1].due.localeCompare(right[1].due) || left[1].addedAt - right[1].addedAt)
    .map(([id]) => id);
}

export function rememberSearch(prev: Persisted, query: string): Persisted {
  const text = query.trim();
  if (!text) return prev;
  const searchHistory = [text, ...prev.searchHistory.filter((item) => item !== text)].slice(0, HISTORY_LIMIT);
  return { ...prev, searchHistory };
}

export function clearSearchHistory(prev: Persisted): Persisted {
  return { ...prev, searchHistory: [] };
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
