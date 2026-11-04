import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionCard } from '@/components/QuestionCard';
import { T } from '@/components/Text';
import { catalogById } from '@/data/subjects';
import { termIdsForSubject, useBank } from '@/state/bank';
import { useProgress, type LessonResult } from '@/state/progress';
import { theme as darkFallback, useTheme } from '@/theme';
import { firstParam } from '@/utils';

export default function ChapterQuiz() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string }>();
  const theme = useTheme();
  const categoryId = firstParam(params.category);
  const { data, awardAnswer, finishLesson } = useProgress();
  const { activeQuestions } = useBank();
  const ids = useMemo(() => new Set(termIdsForSubject(categoryId, data.customTerms)), [categoryId, data.customTerms]);
  const list = useMemo(() => activeQuestions.filter((question) => ids.has(question.termId)), [activeQuestions, ids]);
  const valid = list.length > 0;
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [xpPop, setXpPop] = useState<number | null>(null);
  const [hearts, setHearts] = useState(data.hearts);
  const startedAt = useRef(Date.now());
  const correctCount = useRef(0);
  const answeredCount = useRef(0);
  const xpSum = useRef(0);
  const streak = useRef(0);
  const mistakes = useRef<string[]>([]);
  const question = list[index];
  const title = catalogById[categoryId]?.name ?? data.customSubjects.find((subject) => subject.id === categoryId)?.name ?? '章节';

  useEffect(() => {
    setNote(null);
    setXpPop(null);
  }, [question?.id]);

  function finish(partial = false) {
    const total = answeredCount.current;
    if (total === 0) {
      router.back();
      return;
    }
    const result: LessonResult = {
      title,
      correct: correctCount.current,
      total,
      xp: xpSum.current,
      stars: 0,
      seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
      mistakeIds: [...mistakes.current],
      heartsLeft: hearts,
    };
    finishLesson(result);
    router.replace('/quiz/result');
    void partial;
  }

  if (!valid || !question) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <T>没有这个章节</T>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <T bold color={theme.white}>返回</T>
        </Pressable>
      </View>
    );
  }

  const last = index >= list.length - 1;
  const blocked = hearts <= 0 && xpPop === null && note === null && answeredCount.current > 0 && index > 0;

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <QuestionCard
        key={question.id}
        question={question}
        index={index}
        total={list.length}
        kicker={title}
        extraNote={note}
        onBack={() => finish(true)}
        backLabel="结束"
        nextLabel={hearts <= 0 || last ? '查看成绩' : '下一题'}
        toolbar={
          <View style={styles.toolbar}>
            <View style={styles.hearts} testID="hearts">
              {Array.from({ length: 5 }, (_, heart) => (
                <T key={heart} color={heart < hearts ? theme.wrong : theme.faint}>
                  ♥
                </T>
              ))}
            </View>
            {xpPop !== null ? (
              <T bold color={theme.primary} testID="xp-pop">
                +{xpPop} XP
              </T>
            ) : (
              <T color={theme.muted}>本章爱心</T>
            )}
          </View>
        }
        onAnswer={(choice) => {
          const nextStreak = choice === question.answerIndex ? streak.current + 1 : 0;
          const result = awardAnswer(question, choice, 'chapter', nextStreak);
          streak.current = nextStreak;
          answeredCount.current += 1;
          if (result.isCorrect) correctCount.current += 1;
          else mistakes.current.push(question.id);
          xpSum.current += result.xp;
          setHearts(result.hearts);
          setXpPop(result.xp > 0 ? result.xp : null);
          setNote(result.isCorrect ? (nextStreak > 1 ? '连对加成已计入' : null) : '这道题已放进错题本，并失去 1 颗爱心。');
        }}
        onNext={() => {
          if (hearts <= 0 || last) finish();
          else setIndex((current) => current + 1);
        }}
      />
      {blocked ? null : null}
    </View>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: darkFallback.bg },
  missing: { flex: 1, backgroundColor: darkFallback.bg, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 16 },
  button: { backgroundColor: darkFallback.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12 },
  toolbar: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingHorizontal: 16, paddingVertical: 6 },
  hearts: { flexDirection: 'row' as const, gap: 4 },
};
