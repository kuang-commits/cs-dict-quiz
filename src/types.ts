export type CategoryId = 'network' | 'programming' | 'database' | 'os' | 'security' | 'web';

export type Term = {
  id: string;
  category: CategoryId;
  english: string;
  pronunciation: string;
  chinese: string;
  explanation: string;
  example: string;
};

export type QuestionType = 'en-to-zh' | 'zh-to-en' | 'fill-in';

export type Question = {
  id: string;
  termId: string;
  category: CategoryId;
  type: QuestionType;
  headline: string;
  prompt: string;
  helper?: string;
  pronunciation?: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
};

export type AnswerMode = 'chapter' | 'exam' | 'wrong';

export type WrongEntry = {
  correctRetries: number;
  updatedAt: number;
};

export type ExamItem = {
  questionId: string;
  chosen: number | null;
};

export type ExamResult = {
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  elapsedSec: number;
  finishedAt: number;
  timedOut: boolean;
  items: ExamItem[];
};

export type Persisted = {
  version: 1;
  favorites: string[];
  learnedTermIds: string[];
  seenQuestionIds: string[];
  answered: number;
  correct: number;
  streak: number;
  lastActiveDate: string | null;
  wrongs: Record<string, WrongEntry>;
  lastExam: ExamResult | null;
};

export type AnswerResult = {
  isCorrect: boolean;
  correctRetries: number;
  removed: boolean;
};
