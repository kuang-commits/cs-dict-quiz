export type CategoryId =
  | 'network'
  | 'programming'
  | 'database'
  | 'os'
  | 'security'
  | 'web'
  | 'python'
  | 'linux'
  | 'ruankao'
  | 'custom';

export type ExampleSentence = {
  english: string;
  chinese: string;
};

export type Term = {
  id: string;
  category: CategoryId;
  english: string;
  pronunciation: string;
  partOfSpeech: string;
  chinese: string;
  explanation: string;
  /** Sentence used by fill-in questions. It contains the English headword once. */
  example: string;
  examples: ExampleSentence[];
  related: string[];
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

export type VocabOrigin = 'manual' | 'subject';

export type VocabCard = {
  addedAt: number;
  stage: number;
  due: string;
  origin: VocabOrigin;
};

export type CustomSubject = {
  id: string;
  name: string;
  createdAt: number;
};

export type CustomTerm = {
  id: string;
  subjectId: string;
  english: string;
  pronunciation: string;
  chinese: string;
  example: string;
};

export type ColorMode = 'dark' | 'light';

export type ReviewRating = 'know' | 'fuzzy' | 'forget';

export type Persisted = {
  version: 3;
  vocab: Record<string, VocabCard>;
  searchHistory: string[];
  learnedTermIds: string[];
  seenQuestionIds: string[];
  answered: number;
  correct: number;
  streak: number;
  lastActiveDate: string | null;
  wrongs: Record<string, WrongEntry>;
  lastExam: ExamResult | null;
  subjectIds: string[];
  customSubjects: CustomSubject[];
  customTerms: CustomTerm[];
  colorMode: ColorMode;
};

export type AnswerResult = {
  isCorrect: boolean;
  correctRetries: number;
  removed: boolean;
};
