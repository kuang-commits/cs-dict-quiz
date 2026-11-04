import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionCard } from '@/components/QuestionCard';
import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { questionById } from '@/data/questions';
import { WRONG_RETRIES_TO_CLEAR } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme } from '@/theme';

export default function WrongQuiz() {
  const insets = useSafeAreaInsets();
  const { data, awardAnswer } = useProgress();
  const ids = useMemo(
    () =>
      Object.entries(data.wrongs)
        .sort((left, right) => right[1].updatedAt - left[1].updatedAt)
        .map(([id]) => id)
        .filter((id) => questionById[id]),
    // Capture the queue when the screen opens. Later removals should not reshuffle it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const question = questionById[ids[index] ?? ''];

  useEffect(() => {
    setNote(null);
  }, [question?.id]);

  if (ids.length === 0 || done || !question) {
    const left = Object.keys(data.wrongs).length;
    return (
      <View style={[styles.done, { paddingTop: insets.top }]}>
        <T bold style={styles.doneTitle}>
          {ids.length === 0 ? '错题本是空的' : '这一轮重练结束'}
        </T>
        <T color={theme.muted} style={styles.doneBody}>
          {left > 0 ? `错题本还剩 ${left} 题。` : '错题本已经清空。'}
        </T>
        <Pressable onPress={() => router.back()} style={styles.button} accessibilityRole="button">
          <T bold color={theme.white}>
            返回错题本
          </T>
        </Pressable>
      </View>
    );
  }

  const last = index >= ids.length - 1;
  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <QuestionCard
        key={question.id}
        question={question}
        index={index}
        total={ids.length}
        kicker={`错题 · ${categoryById[question.category].name}`}
        extraNote={note}
        onBack={() => router.back()}
        nextLabel={last ? '完成本轮' : '下一题'}
        onAnswer={(choice) => {
          const result = awardAnswer(question, choice, 'wrong', choice === question.answerIndex ? 1 : 0);
          if (!result.isCorrect) {
            setNote('连续做对次数已清零，这题还留在错题本。');
          } else if (result.removed) {
            setNote(`连续做对 ${WRONG_RETRIES_TO_CLEAR} 次，已从错题本移出。答对找回 1 颗爱心。`);
          } else {
            setNote(`做对了，找回 1 颗爱心。再连续做对 ${WRONG_RETRIES_TO_CLEAR - result.correctRetries} 次就会移出。`);
          }
        }}
        onNext={() => {
          if (last) setDone(true);
          else setIndex((current) => current + 1);
        }}
      />
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  done: {
    flex: 1,
    backgroundColor: theme.bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 28,
    gap: 10,
  },
  doneTitle: {
    fontSize: 24,
  },
  doneBody: {
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.primary,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
