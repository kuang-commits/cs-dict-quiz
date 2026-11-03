import { useMemo } from 'react';

import { questions as builtinQuestions, buildQuestions } from '@/data/questions';
import { CATALOG, catalogById } from '@/data/subjects';
import { terms } from '@/data/terms';
import { useProgress } from '@/state/progress';
import type { CustomTerm, Question, Term } from '@/types';

export function materializeCustom(input: CustomTerm): Term {
  const example = input.example.includes(input.english) ? input.example : `${input.example}（${input.english}）`;
  return {
    id: input.id,
    category: 'custom',
    english: input.english,
    pronunciation: input.pronunciation,
    partOfSpeech: '自建',
    chinese: input.chinese,
    explanation: `${input.english} 是你添加的术语，意思是${input.chinese}。`,
    example,
    examples: [
      { english: `${input.english} is a term you added.`, chinese: example },
      { english: `Remember ${input.english}.`, chinese: input.chinese },
    ],
    related: [],
  };
}

export function termIdsForSubject(subjectId: string, customTerms: CustomTerm[]): string[] {
  const catalog = catalogById[subjectId];
  if (catalog) return terms.filter((term) => term.category === catalog.categoryId).map((term) => term.id);
  return customTerms.filter((term) => term.subjectId === subjectId).map((term) => term.id);
}

export function useBank() {
  const { data } = useProgress();
  return useMemo(() => {
    const custom = data.customTerms.map(materializeCustom);
    const pool = [...terms, ...custom];
    const customQuestions = buildQuestions(custom, pool);
    const allQuestions = [...builtinQuestions, ...customQuestions];
    const termMap = Object.fromEntries(pool.map((term) => [term.id, term]));
    const questionMap = Object.fromEntries(allQuestions.map((question) => [question.id, question]));
    const activeIds = new Set(data.subjectIds.flatMap((id) => termIdsForSubject(id, data.customTerms)));
    const activeQuestions = allQuestions.filter((question) => activeIds.has(question.termId));
    return {
      terms: pool,
      termById: termMap as Record<string, Term>,
      questionById: questionMap as Record<string, Question>,
      activeQuestions,
      activeTermIds: activeIds,
    };
  }, [data.customTerms, data.subjectIds]);
}

export function subjectMeta(subjectId: string, customName?: string) {
  return catalogById[subjectId] ?? { id: subjectId, name: customName ?? '自建科目', blurb: '自己添加的术语', level: '入门' as const, categoryId: 'custom' as const };
}

export const catalogSubjects = CATALOG;
