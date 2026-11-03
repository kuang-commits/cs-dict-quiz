import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionCard } from '@/components/QuestionCard';
import { T } from '@/components/Text';
import { EXAM_COUNT, EXAM_SECONDS, gradeExam, pickExamQuestions } from '@/data/questions';
import { useBank } from '@/state/bank';
import { formatClock } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';
import type { Question } from '@/types';

export default function ExamScreen() {
  const insets = useSafeAreaInsets();
  const { recordAnswer, saveExam } = useProgress();
  const { activeQuestions } = useBank();
  const [phase, setPhase] = useState<'intro' | 'quiz'>('intro');
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [confirm, setConfirm] = useState(false);
  const answers = useRef<(number | null)[]>([]);
  const finished = useRef(false);

  useEffect(() => {
    if (phase !== 'quiz') return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [phase]);

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const remaining = Math.max(0, EXAM_SECONDS - elapsed);
  const question = deck[index];

  const finish = useCallback(
    (timedOut: boolean) => {
      if (finished.current) return;
      finished.current = true;
      const elapsedSec = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
      const items = deck.map((item, itemIndex) => ({
        questionId: item.id,
        chosen: answers.current[itemIndex] ?? null,
      }));
      saveExam(gradeExam(items, elapsedSec, timedOut));
      router.replace('/score');
    },
    [deck, saveExam, startedAt],
  );

  useEffect(() => {
    if (phase === 'quiz' && startedAt && remaining === 0) finish(true);
  }, [phase, remaining, startedAt, finish]);

  function start() {
    const picked = pickExamQuestions(EXAM_COUNT, Math.random, activeQuestions);
    if (picked.length === 0) return;
    answers.current = picked.map(() => null);
    finished.current = false;
    setDeck(picked);
    setIndex(0);
    setStartedAt(Date.now());
    setNow(Date.now());
    setPhase('quiz');
  }

  if (phase === 'intro' || !question) {
    return (
      <View style={[styles.page, { paddingTop: insets.top }]} testID="exam-intro">
        <View style={styles.top}>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
            <T>返回</T>
          </Pressable>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.intro}>
          <T color={theme.accent} bold>
            模拟考试
          </T>
          <T bold style={styles.introTitle}>
            {EXAM_COUNT} 题 · {EXAM_SECONDS / 60} 分钟
          </T>
          <T style={styles.introBody}>
            题目只从已添加的科目里抽，最多 {EXAM_COUNT} 题。当前题库 {activeQuestions.length} 题。
          </T>
          <View style={styles.rules}>
            <Rule text="每题四个选项，点选之后才显示对错和解析。" />
            <Rule text="可以提前交卷。没做的题按答错计分。" />
            <Rule text="这次答错的题会进入错题本。" />
            <Rule text="倒计时结束会自动交卷。" />
          </View>
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable onPress={start} style={styles.primary} testID="start-exam" accessibilityRole="button">
            <T bold color={theme.white}>
              开始考试
            </T>
          </Pressable>
        </View>
      </View>
    );
  }

  const last = index >= deck.length - 1;
  return (
    <View style={[styles.page, { paddingTop: insets.top }]} testID="exam-quiz">
      <QuestionCard
        key={question.id}
        question={question}
        index={index}
        total={deck.length}
        kicker="模拟考试"
        onBack={() => setConfirm(true)}
        backLabel="交卷"
        headerRight={
          <T bold color={remaining <= 60 ? theme.wrong : theme.ink} testID="exam-timer">
            {formatClock(remaining)}
          </T>
        }
        nextLabel={last ? '交卷' : '下一题'}
        onAnswer={(choice) => {
          if (answers.current[index] !== null) return;
          answers.current[index] = choice;
          recordAnswer(question, choice, 'exam');
        }}
        onNext={() => {
          if (last) setConfirm(true);
          else setIndex((current) => current + 1);
        }}
      />
      {confirm ? (
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <T bold style={styles.dialogTitle}>
              确定交卷？
            </T>
            <T style={styles.dialogBody}>
              已做 {countAnswered(answers.current)} / {deck.length} 题。没做的题按答错计分，答错的题会进入错题本。
            </T>
            <View style={styles.dialogActions}>
              <Pressable onPress={() => setConfirm(false)} style={styles.ghost} accessibilityRole="button">
                <T bold>继续答题</T>
              </Pressable>
              <Pressable
                onPress={() => finish(false)}
                style={styles.danger}
                testID="confirm-submit"
                accessibilityRole="button"
              >
                <T bold color={theme.white}>
                  确定交卷
                </T>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
      <View style={{ height: Math.max(insets.bottom, 0) }} />
    </View>
  );
}

function countAnswered(choices: (number | null)[]) {
  return choices.filter((choice) => choice !== null).length;
}

function Rule({ text }: { text: string }) {
  return (
    <View style={styles.rule}>
      <View style={styles.dot} />
      <T style={styles.ruleText}>{text}</T>
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  top: {
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center' as const,
  },
  intro: {
    padding: 22,
    gap: 10,
  },
  introTitle: {
    fontSize: 34,
    lineHeight: 42,
  },
  introBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  rules: {
    marginTop: 8,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    ...shadow,
    shadowOpacity: 0.04,
  },
  rule: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.accent,
    marginTop: 7,
  },
  ruleText: {
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  primary: {
    backgroundColor: theme.accent,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(28,25,21,0.45)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 24,
  },
  dialog: {
    width: '100%' as const,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  dialogTitle: {
    fontSize: 20,
  },
  dialogBody: {
    lineHeight: 22,
  },
  dialogActions: {
    flexDirection: 'row' as const,
    gap: 10,
    marginTop: 6,
  },
  ghost: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  danger: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: theme.wrong,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
