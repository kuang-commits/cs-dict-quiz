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

function distractors(term: Term, field: 'english' | 'chinese', seed: number): string[] {
  const same = terms.filter((item) => item.id !== term.id && item.category === term.category);
  const other = terms.filter((item) => item.id !== term.id && item.category !== term.category);
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

function buildQuestion(term: Term, type: QuestionType): Question {
  const seed = hash(`${term.id}:${type}`);
  if (type === 'en-to-zh') {
    const options = distractors(term, 'chinese', seed);
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
    const options = distractors(term, 'english', seed);
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
  const options = distractors(term, 'english', seed);
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

export function buildQuestions(source: Term[] = terms): Question[] {
  const types: QuestionType[] = ['en-to-zh', 'zh-to-en', 'fill-in'];
  return source.flatMap((term) => types.map((type) => buildQuestion(term, type)));
}

export const questions = buildQuestions();

export const termById = Object.fromEntries(terms.map((term) => [term.id, term]));
export const questionById = Object.fromEntries(questions.map((question) => [question.id, question]));

export function questionsForCategory(category: Term['category']): Question[] {
  return questions.filter((question) => question.category === category);
}

export function pickExamQuestions(count = EXAM_COUNT, random: () => number = Math.random): Question[] {
  return shuffle(questions, Math.floor(random() * 0xffffffff) || 1).slice(0, count);
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

export function searchTerms(query: string, category: Term['category'] | 'all' = 'all'): Term[] {
  const folded = query.trim().toLowerCase();
  const raw = query.trim();
  return terms
    .filter((term) => (category === 'all' ? true : term.category === category))
    .filter((term) => {
      if (!folded) return true;
      return (
        term.english.toLowerCase().includes(folded) ||
        term.chinese.includes(raw) ||
        term.pronunciation.includes(raw) ||
        term.explanation.includes(raw)
      );
    })
    .sort((left, right) => rank(left, folded, raw) - rank(right, folded, raw));
}

function rank(term: Term, folded: string, raw: string): number {
  if (!folded) return 0;
  const english = term.english.toLowerCase();
  if (english === folded) return 0;
  if (english.startsWith(folded)) return 1;
  if (term.chinese === raw) return 2;
  if (term.chinese.includes(raw)) return 3;
  return 4;
}
