import { terms } from '@/data/terms';
import type { ExamItem, ExamResult, Question, QuestionType, Term } from '@/types';

export const EXAM_COUNT = 20;
export const EXAM_SECONDS = 10 * 60;

export const TYPE_LABEL: Record<QuestionType, string> = {
  'en-to-zh': '英文选义',
  'zh-to-en': '中文选词',
  'fill-in': '例句填空',
};

function hash(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const random = mulberry32(seed);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function distractors(pool: Term[], term: Term, field: 'english' | 'chinese', seed: number): string[] {
  const same = pool.filter((item) => item.id !== term.id && item.category === term.category);
  const other = pool.filter((item) => item.id !== term.id && item.category !== term.category);
  const ordered = [...shuffle(same, seed), ...shuffle(other, seed + 17)];
  const picked: string[] = [];
  const correct = term[field];
  for (const item of ordered) {
    const value = item[field];
    if (value === correct || picked.includes(value)) continue;
    picked.push(value);
    if (picked.length === 3) break;
  }
  if (picked.length < 3) {
    throw new Error(`干扰项不足：${term.id} ${field}`);
  }
  return picked;
}

function blankExample(example: string, english: string): string {
  const at = example.indexOf(english);
  if (at < 0) throw new Error(`例句里没有术语：${english}`);
  return `${example.slice(0, at)}____${example.slice(at + english.length)}`;
}

function buildQuestion(pool: Term[], term: Term, type: QuestionType): Question {
  const seed = hash(`${term.id}:${type}`);
  if (type === 'en-to-zh') {
    const options = distractors(pool, term, 'chinese', seed);
    const answerIndex = seed % 4;
    options.splice(answerIndex, 0, term.chinese);
    return {
      id: `${term.id}:${type}`,
      termId: term.id,
      category: term.category,
      type,
      headline: term.english,
      prompt: '这个英文术语的中文意思是？',
      pronunciation: term.pronunciation,
      options: options as Question['options'],
      answerIndex,
      explanation: `${term.english}（${term.pronunciation}）的意思是「${term.chinese}」。${term.explanation}`,
    };
  }
  if (type === 'zh-to-en') {
    const options = distractors(pool, term, 'english', seed);
    const answerIndex = seed % 4;
    options.splice(answerIndex, 0, term.english);
    return {
      id: `${term.id}:${type}`,
      termId: term.id,
      category: term.category,
      type,
      headline: term.chinese,
      prompt: '它对应的英文术语是哪一个？',
      options: options as Question['options'],
      answerIndex,
      explanation: `「${term.chinese}」写成英文是 ${term.english}，可以按「${term.pronunciation}」来记读音。`,
    };
  }
  const options = distractors(pool, term, 'english', seed);
  const answerIndex = seed % 4;
  options.splice(answerIndex, 0, term.english);
  return {
    id: `${term.id}:${type}`,
    termId: term.id,
    category: term.category,
    type,
    headline: '选词填空',
    prompt: blankExample(term.example, term.english),
    helper: '选择最合适的英文术语填入横线。',
    options: options as Question['options'],
    answerIndex,
    explanation: `横线处应填 ${term.english}（${term.chinese}）。${term.explanation}`,
  };
}

export function buildQuestions(source: Term[] = terms, pool: Term[] = source): Question[] {
  const types: QuestionType[] = ['en-to-zh', 'zh-to-en', 'fill-in'];
  return source.flatMap((term) => types.map((type) => buildQuestion(pool, term, type)));
}

export const questions = buildQuestions();

export const termById = Object.fromEntries(terms.map((term) => [term.id, term]));
export const questionById = Object.fromEntries(questions.map((question) => [question.id, question]));

export function questionsForCategory(category: Term['category']): Question[] {
  return questions.filter((question) => question.category === category);
}

export function pickExamQuestions(
  count = EXAM_COUNT,
  random: () => number = Math.random,
  pool: Question[] = questions,
): Question[] {
  const size = Math.min(count, pool.length);
  return shuffle(pool, Math.floor(random() * 0xffffffff) || 1).slice(0, size);
}

export function gradeExam(items: ExamItem[], elapsedSec: number, timedOut: boolean, now = Date.now()): ExamResult {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  for (const item of items) {
    const question = questionById[item.questionId];
    if (!question || item.chosen === null) unanswered += 1;
    else if (item.chosen === question.answerIndex) correct += 1;
    else wrong += 1;
  }
  return {
    total: items.length,
    correct,
    wrong,
    unanswered,
    elapsedSec,
    finishedAt: now,
    timedOut,
    items,
  };
}

export function suggestTerms(query: string, limit = 8): Term[] {
  const raw = query.trim();
  if (!raw) return [];
  return terms
    .map((term) => ({ term, score: fuzzyScore(term, raw) }))
    .filter((item) => item.score < 40)
    .sort((left, right) => left.score - right.score || left.term.english.localeCompare(right.term.english))
    .slice(0, limit)
    .map((item) => item.term);
}

function fuzzyScore(term: Term, raw: string): number {
  const folded = raw.toLowerCase();
  const english = term.english.toLowerCase();
  const compact = english.replace(/\s+/g, '');
  const queryCompact = folded.replace(/\s+/g, '');
  if (english === folded || term.chinese === raw) return 0;
  if (english.startsWith(folded) || compact.startsWith(queryCompact)) return 1;
  if (term.chinese.startsWith(raw)) return 2;
  if (english.includes(folded) || compact.includes(queryCompact)) return 3;
  if (term.chinese.includes(raw) || term.pronunciation.includes(raw)) return 4;
  if (isSubsequence(queryCompact, compact)) return 5;
  const distance = levenshtein(queryCompact, compact);
  const allowance = queryCompact.length <= 4 ? 1 : 2;
  if (queryCompact.length >= 2 && distance <= allowance) return 10 + distance;
  return 40;
}

function isSubsequence(query: string, text: string): boolean {
  if (query.length < 2 || query.length > text.length) return false;
  let cursor = 0;
  for (const char of text) {
    if (char === query[cursor]) cursor += 1;
    if (cursor === query.length) return true;
  }
  return false;
}

function levenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const table = Array.from({ length: rows }, () => Array<number>(cols).fill(0));
  for (let row = 0; row < rows; row += 1) table[row][0] = row;
  for (let col = 0; col < cols; col += 1) table[0][col] = col;
  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      table[row][col] = Math.min(table[row - 1][col] + 1, table[row][col - 1] + 1, table[row - 1][col - 1] + cost);
    }
  }
  return table[left.length][right.length];
}
