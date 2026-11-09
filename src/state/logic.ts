import { addXp, CODING_PASS_XP, earnedAchievements } from '@/state/scoring';
import type {
  AnswerMode,
  AnswerResult,
  ColorMode,
  CustomSubject,
  CustomTerm,
  ExamResult,
  Persisted,
  Question,
  ReviewRating,
  VocabCard,
} from '@/types';

export const WRONG_RETRIES_TO_CLEAR = 2;
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15] as const;
const HISTORY_LIMIT = 12;

export function emptyProgress(): Persisted {
  return {
    version: 5,
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
    subjectIds: [],
    customSubjects: [],
    customTerms: [],
    colorMode: 'dark',
    codingSolved: [],
    codingWrongs: {},
    totalXp: 0,
    todayXp: 0,
    todayKey: null,
    dailyGoal: 20,
    hearts: 5,
    heartsDate: null,
    weekKey: null,
    weeklyXp: 0,
    lessonsCompleted: 0,
    achievements: [],
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
    subjectIds?: unknown;
    customSubjects?: unknown;
    customTerms?: unknown;
    colorMode?: unknown;
    codingSolved?: unknown;
    codingWrongs?: unknown;
    totalXp?: unknown;
    todayXp?: unknown;
    todayKey?: unknown;
    dailyGoal?: unknown;
    hearts?: unknown;
    heartsDate?: unknown;
    weekKey?: unknown;
    weeklyXp?: unknown;
    lessonsCompleted?: unknown;
    achievements?: unknown;
  };
  if (![1, 2, 3, 4, 5].includes(value.version ?? 0)) return base;
  const vocab = normalizeVocab(value.vocab);
  const today = dateKey(new Date());
  for (const id of stringList(value.favorites)) {
    if (!vocab[id]) vocab[id] = { addedAt: 0, stage: 0, due: today, origin: 'manual' };
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
    subjectIds: stringList(value.subjectIds),
    customSubjects: normalizeSubjects(value.customSubjects),
    customTerms: normalizeCustomTerms(value.customTerms),
    colorMode: value.colorMode === 'light' ? 'light' : 'dark',
    codingSolved: stringList(value.codingSolved),
    codingWrongs: normalizeCodingWrongs(value.codingWrongs),
    totalXp: numberOr(value.totalXp, 0),
    todayXp: numberOr(value.todayXp, 0),
    todayKey: typeof value.todayKey === 'string' ? value.todayKey : null,
    dailyGoal: value.dailyGoal === 10 || value.dailyGoal === 20 || value.dailyGoal === 30 || value.dailyGoal === 50 ? value.dailyGoal : 20,
    hearts: numberOr(value.hearts, 5),
    heartsDate: typeof value.heartsDate === 'string' ? value.heartsDate : null,
    weekKey: typeof value.weekKey === 'string' ? value.weekKey : null,
    weeklyXp: numberOr(value.weeklyXp, 0),
    lessonsCompleted: numberOr(value.lessonsCompleted, 0),
    achievements: stringList(value.achievements),
  };
}

function normalizeCodingWrongs(value: unknown): Record<string, { updatedAt: number }> {
  if (!value || typeof value !== 'object') return {};
  const wrongs: Record<string, { updatedAt: number }> = {};
  for (const [id, entry] of Object.entries(value as Record<string, { updatedAt?: number }>)) {
    wrongs[id] = { updatedAt: numberOr(entry?.updatedAt, 0) };
  }
  return wrongs;
}

export function recordCoding(prev: Persisted, problemId: string, passed: boolean, now = new Date()): Persisted {
  const codingWrongs = { ...prev.codingWrongs };
  const solved = new Set(prev.codingSolved);
  if (passed) {
    delete codingWrongs[problemId];
    solved.add(problemId);
  } else {
    codingWrongs[problemId] = { updatedAt: now.getTime() };
  }
  const scored = { ...prev, codingWrongs, codingSolved: [...solved] };
  if (passed && !prev.codingSolved.includes(problemId)) {
    return { ...addXp(scored, CODING_PASS_XP, now), achievements: earnedAchievements({ ...scored, totalXp: scored.totalXp + CODING_PASS_XP }) };
  }
  return { ...scored, achievements: earnedAchievements(scored) };
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
      origin: card.origin === 'subject' ? 'subject' : 'manual',
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
      [termId]: { addedAt: now.getTime(), stage: 0, due: dateKey(now), origin: 'manual' },
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

function normalizeSubjects(value: unknown): CustomSubject[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const subject = item as Partial<CustomSubject>;
      return {
        id: typeof subject.id === 'string' ? subject.id : '',
        name: typeof subject.name === 'string' ? subject.name : '',
        createdAt: numberOr(subject.createdAt, 0),
      };
    })
    .filter((subject) => subject.id && subject.name);
}

function normalizeCustomTerms(value: unknown): CustomTerm[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const term = item as Partial<CustomTerm>;
      return {
        id: typeof term.id === 'string' ? term.id : '',
        subjectId: typeof term.subjectId === 'string' ? term.subjectId : '',
        english: typeof term.english === 'string' ? term.english : '',
        pronunciation: typeof term.pronunciation === 'string' ? term.pronunciation : '',
        chinese: typeof term.chinese === 'string' ? term.chinese : '',
        example: typeof term.example === 'string' ? term.example : '',
      };
    })
    .filter((term) => term.id && term.subjectId && term.english && term.chinese);
}

export function setColorMode(prev: Persisted, colorMode: ColorMode): Persisted {
  return { ...prev, colorMode };
}

export function enrollSubject(prev: Persisted, subjectId: string, termIds: string[], now = new Date()): Persisted {
  const vocab = { ...prev.vocab };
  for (const id of termIds) {
    if (!vocab[id]) {
      vocab[id] = { addedAt: now.getTime(), stage: 0, due: dateKey(now), origin: 'subject' };
    }
  }
  const subjectIds = prev.subjectIds.includes(subjectId) ? prev.subjectIds : [...prev.subjectIds, subjectId];
  return { ...prev, subjectIds, vocab };
}

export function unenrollSubject(prev: Persisted, subjectId: string, termIds: string[]): Persisted {
  const vocab = { ...prev.vocab };
  for (const id of termIds) {
    if (vocab[id]?.origin === 'subject') delete vocab[id];
  }
  return { ...prev, subjectIds: prev.subjectIds.filter((id) => id !== subjectId), vocab };
}

export function createCustomSubject(prev: Persisted, name: string, now = new Date()): Persisted {
  const subject: CustomSubject = { id: `user-${now.getTime()}`, name: name.trim(), createdAt: now.getTime() };
  if (!subject.name) return prev;
  const subjectIds = prev.subjectIds.includes(subject.id) ? prev.subjectIds : [...prev.subjectIds, subject.id];
  return { ...prev, customSubjects: [...prev.customSubjects, subject], subjectIds };
}

export function addCustomTerm(prev: Persisted, subjectId: string, input: Omit<CustomTerm, 'id' | 'subjectId'>, now = new Date()): Persisted {
  const english = input.english.trim();
  const chinese = input.chinese.trim();
  if (!english || !chinese) return prev;
  const example = input.example.includes(english) ? input.example.trim() : `${input.example.trim()} ${english}`.trim();
  const term: CustomTerm = {
    id: `custom-${now.getTime()}`,
    subjectId,
    english,
    pronunciation: input.pronunciation.trim() || '自建',
    chinese,
    example,
  };
  const customTerms = [...prev.customTerms, term];
  const vocab =
    prev.subjectIds.includes(subjectId) && !prev.vocab[term.id]
      ? {
          ...prev.vocab,
          [term.id]: { addedAt: now.getTime(), stage: 0, due: dateKey(now), origin: 'subject' as const },
        }
      : prev.vocab;
  return { ...prev, customTerms, vocab };
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
