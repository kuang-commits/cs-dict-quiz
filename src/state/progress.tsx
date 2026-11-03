import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { T } from '@/components/Text';
import { theme } from '@/theme';
import type { AnswerMode, AnswerResult, ExamResult, Persisted, Question, ReviewRating } from '@/types';
import {
  applyAnswer,
  clearSearchHistory,
  dueVocabIds,
  emptyProgress,
  normalizeProgress,
  rateVocab,
  rememberSearch,
  toggleVocab,
} from '@/state/logic';
import { View } from 'react-native';

const STORAGE_KEY = 'cs-dict-quiz-v2';
const LEGACY_KEY = 'cs-dict-quiz-v1';

type ProgressValue = {
  ready: boolean;
  data: Persisted;
  wrongCount: number;
  dueCount: number;
  accuracy: number | null;
  recordAnswer: (question: Question, chosen: number, mode: AnswerMode) => AnswerResult;
  saveExam: (exam: ExamResult) => void;
  toggleVocab: (termId: string) => boolean;
  rateReview: (termId: string, rating: ReviewRating) => void;
  rememberSearch: (query: string) => void;
  clearSearchHistory: () => void;
};

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Persisted>(emptyProgress);
  const [ready, setReady] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(async (raw) => {
        if (cancelled) return;
        const legacy = raw ? null : await AsyncStorage.getItem(LEGACY_KEY);
        const source = raw ?? legacy;
        if (source) {
          try {
            setData(normalizeProgress(JSON.parse(source)));
          } catch {
            setData(emptyProgress());
          }
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, ready]);

  const recordAnswer = useCallback((question: Question, chosen: number, mode: AnswerMode) => {
    const applied = applyAnswer(dataRef.current, question, chosen, mode);
    dataRef.current = applied.state;
    setData(applied.state);
    return applied.result;
  }, []);

  const saveExam = useCallback((exam: ExamResult) => {
    const next = { ...dataRef.current, lastExam: exam };
    dataRef.current = next;
    setData(next);
  }, []);

  const toggle = useCallback((termId: string) => {
    const next = toggleVocab(dataRef.current, termId);
    dataRef.current = next;
    setData(next);
    return Boolean(next.vocab[termId]);
  }, []);

  const rateReview = useCallback((termId: string, rating: ReviewRating) => {
    const next = rateVocab(dataRef.current, termId, rating);
    dataRef.current = next;
    setData(next);
  }, []);

  const remember = useCallback((query: string) => {
    const next = rememberSearch(dataRef.current, query);
    dataRef.current = next;
    setData(next);
  }, []);

  const clearHistory = useCallback(() => {
    const next = clearSearchHistory(dataRef.current);
    dataRef.current = next;
    setData(next);
  }, []);

  const value = useMemo<ProgressValue>(
    () => ({
      ready,
      data,
      wrongCount: Object.keys(data.wrongs).length,
      dueCount: dueVocabIds(data).length,
      accuracy: data.answered === 0 ? null : data.correct / data.answered,
      recordAnswer,
      saveExam,
      toggleVocab: toggle,
      rateReview,
      rememberSearch: remember,
      clearSearchHistory: clearHistory,
    }),
    [ready, data, recordAnswer, saveExam, toggle, rateReview, remember, clearHistory],
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <T color={theme.muted}>正在准备词库…</T>
      </View>
    );
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress 必须放在 ProgressProvider 里');
  return value;
}
