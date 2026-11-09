import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { questionById } from '@/data/questions';
import { examPoints, formatClock } from '@/state/logic';
import { EXAM_PASS_LINE } from '@/state/scoring';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';

export default function ScoreScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const exam = data.lastExam;

  if (!exam) {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]}>
        <T>还没有考试记录</T>
        <Pressable onPress={() => router.replace('/quiz')} style={styles.primary}>
          <T bold color={theme.white}>
            返回刷题
          </T>
        </Pressable>
      </View>
    );
  }

  const points = examPoints(exam);
  const accuracy = exam.total === 0 ? 0 : Math.round((exam.correct / exam.total) * 100);
  const missed = exam.items.filter((item) => {
    const question = questionById[item.questionId];
    return question && item.chosen !== null && item.chosen !== question.answerIndex;
  });

  return (
    <View style={[styles.page, { paddingTop: insets.top }]} testID="score-screen">
      <ScrollView contentContainerStyle={styles.scroll}>
        <T color={theme.muted}>考试结束</T>
        <T bold style={styles.points}>
          {points}
          <T bold style={styles.unit}>
            {' '}
            分
          </T>
        </T>
        <T style={styles.accuracy}>正确率 {accuracy}% · 用时 {formatClock(exam.elapsedSec)}</T>
        <T bold color={points >= EXAM_PASS_LINE ? theme.primary : theme.wrong} testID="exam-pass-line">
          及格线 {EXAM_PASS_LINE} 分 · {points >= EXAM_PASS_LINE ? '合格' : '未及格'}
        </T>
        {exam.timedOut ? <T color={theme.wrong}>倒计时结束，已自动交卷。</T> : null}
        <View style={styles.summary}>
          <Mini label="答对" value={String(exam.correct)} color={theme.primary} />
          <Mini label="答错" value={String(exam.wrong)} color={theme.wrong} />
          <Mini label="未答" value={String(exam.unanswered)} color={theme.accent} />
        </View>
        <T color={theme.muted} style={styles.hint}>
          满分 100。没做的题按答错计分，但不会写进错题本；这次真正答错的题已经放进错题本。
        </T>
        <T bold style={styles.section}>
          错题回顾
        </T>
        {missed.length === 0 ? (
          <T color={theme.muted}>这次没有答错的题。</T>
        ) : (
          missed.map((item) => {
            const question = questionById[item.questionId];
            if (!question || item.chosen === null) return null;
            return (
              <View key={item.questionId} style={styles.card}>
                <T bold>{question.headline}</T>
                <T color={theme.muted}>{question.prompt}</T>
                <T color={theme.wrong}>你的选择：{question.options[item.chosen]}</T>
                <T color={theme.primary}>正确答案：{question.options[question.answerIndex]}</T>
              </View>
            );
          })
        )}
        {exam.unanswered > 0 ? (
          <T color={theme.muted} style={styles.hint}>
            还有 {exam.unanswered} 题没做。
          </T>
        ) : null}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={() => router.dismissTo('/quiz')} style={styles.ghost} testID="score-home" accessibilityRole="button">
          <T bold>返回刷题</T>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/exam')}
          style={styles.primary}
          testID="score-retry"
          accessibilityRole="button"
        >
          <T bold color={theme.white}>
            再考一次
          </T>
        </Pressable>
      </View>
    </View>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.mini}>
      <T bold color={color} style={styles.miniValue}>
        {value}
      </T>
      <T color={theme.muted}>{label}</T>
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
  },
  scroll: {
    padding: 22,
    gap: 8,
  },
  points: {
    fontSize: 72,
    lineHeight: 80,
  },
  unit: {
    fontSize: 22,
  },
  accuracy: {
    fontSize: 16,
  },
  summary: {
    marginTop: 8,
    flexDirection: 'row' as const,
    backgroundColor: theme.card,
    borderRadius: 16,
    paddingVertical: 12,
    ...shadow,
    shadowOpacity: 0.04,
  },
  mini: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 2,
  },
  miniValue: {
    fontSize: 22,
  },
  hint: {
    lineHeight: 20,
    fontSize: 13,
  },
  section: {
    marginTop: 8,
    fontSize: 18,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.line,
  },
  footer: {
    flexDirection: 'row' as const,
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  ghost: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: theme.card,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primary: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 12,
  },
};
