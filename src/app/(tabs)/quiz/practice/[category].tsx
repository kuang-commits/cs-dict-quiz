import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionCard } from '@/components/QuestionCard';
import { T } from '@/components/Text';
import { catalogById } from '@/data/subjects';
import { termIdsForSubject, useBank } from '@/state/bank';
import { useProgress } from '@/state/progress';
import { theme as darkFallback, useTheme } from '@/theme';
import { firstParam } from '@/utils';

export default function ChapterQuiz() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string }>();
  const theme = useTheme();
  const categoryId = firstParam(params.category);
  const { data, recordAnswer } = useProgress();
  const { activeQuestions } = useBank();
  const ids = useMemo(() => new Set(termIdsForSubject(categoryId, data.customTerms)), [categoryId, data.customTerms]);
  const list = useMemo(() => activeQuestions.filter((question) => ids.has(question.termId)), [activeQuestions, ids]);
  const valid = list.length > 0;
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const question = list[index];

  useEffect(() => {
    setNote(null);
  }, [question?.id]);

  if (!valid || !question) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <T>没有这个章节</T>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <T bold color={theme.white}>
            返回
          </T>
        </Pressable>
      </View>
    );
  }

  const category = { name: catalogById[categoryId]?.name ?? data.customSubjects.find((subject) => subject.id === categoryId)?.name ?? '章节' };
  const last = index >= list.length - 1;

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <QuestionCard
        key={question.id}
        question={question}
        index={index}
        total={list.length}
        kicker={category.name}
        extraNote={note}
        onBack={() => router.back()}
        nextLabel={last ? '完成本章' : '下一题'}
        onAnswer={(choice) => {
          const result = recordAnswer(question, choice, 'chapter');
          setNote(result.isCorrect ? null : '这道题已放进错题本。');
        }}
        onNext={() => {
          if (last) router.back();
          else setIndex((current) => current + 1);
        }}
      />
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: darkFallback.bg,
  },
  missing: {
    flex: 1,
    backgroundColor: darkFallback.bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 16,
  },
  button: {
    backgroundColor: darkFallback.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
};
