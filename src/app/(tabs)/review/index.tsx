import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { termById } from '@/data/questions';
import { REVIEW_INTERVALS, dueVocabIds } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';
import type { ReviewRating } from '@/types';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { data, rateReview } = useProgress();
  const queue = dueVocabIds(data);
  const term = termById[queue[0] ?? ''];

  function grade(rating: ReviewRating) {
    if (!term) return;
    rateReview(term.id, rating);
  }

  if (!term) {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]} testID="review-empty">
        <T bold style={styles.emptyTitle}>
          今天没有要复习的词
        </T>
        <T color={theme.muted} style={styles.emptyBody}>
          在词卡上加入生词本后，这个词今天就会出现。认识之后，按 1、2、4、7、15 天再见面。
        </T>
      </View>
    );
  }

  const stage = data.vocab[term.id]?.stage ?? 0;
  const stageLabel = `第 ${Math.min(stage + 1, REVIEW_INTERVALS.length)} 档`;

  return (
    <View style={[styles.page, { paddingTop: insets.top + 12 }]} testID="review-screen">
      <T color={theme.muted} style={styles.count}>
        今日复习 1 / {queue.length}
      </T>
      <Flashcard key={term.id} english={term.english} pronunciation={term.pronunciation} chinese={term.chinese} explanation={term.explanation} stageLabel={stageLabel} />
      <View style={styles.actions}>
        <Grade label="不认识" color={theme.wrong} onPress={() => grade('forget')} testID="rate-forget" />
        <Grade label="模糊" color={theme.accent} onPress={() => grade('fuzzy')} testID="rate-fuzzy" />
        <Grade label="认识" color={theme.primary} onPress={() => grade('know')} testID="rate-know" />
      </View>
    </View>
  );
}

function Flashcard({
  english,
  pronunciation,
  chinese,
  explanation,
  stageLabel,
}: {
  english: string;
  pronunciation: string;
  chinese: string;
  explanation: string;
  stageLabel: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Pressable onPress={() => setRevealed(true)} style={styles.card} testID="flip-card" accessibilityRole="button">
      <T color={theme.faint}>{stageLabel}</T>
      <T bold style={styles.word}>
        {english}
      </T>
      <T color={theme.primaryDark}>「{pronunciation}」</T>
      {revealed ? (
        <View style={styles.reveal}>
          <T bold style={styles.meaning}>
            {chinese}
          </T>
          <T color={theme.muted}>{explanation}</T>
        </View>
      ) : (
        <T color={theme.muted}>点卡片查看释义</T>
      )}
    </Pressable>
  );
}

function Grade({
  label,
  color,
  onPress,
  testID,
}: {
  label: string;
  color: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button" style={[styles.grade, { backgroundColor: color }]}>
      <T bold color={theme.white}>
        {label}
      </T>
    </Pressable>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 16 },
  center: { alignItems: 'center' as const, justifyContent: 'center' as const, paddingHorizontal: 28, gap: 8 },
  emptyTitle: { fontSize: 22 },
  emptyBody: { textAlign: 'center' as const, lineHeight: 22 },
  count: { marginBottom: 10 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 22,
    minHeight: 280,
    padding: 22,
    alignItems: 'flex-start' as const,
    justifyContent: 'center' as const,
    gap: 8,
    ...shadow,
  },
  word: { fontSize: 40, lineHeight: 48 },
  reveal: { gap: 6, marginTop: 8 },
  meaning: { fontSize: 22 },
  actions: { flexDirection: 'row' as const, gap: 8, marginTop: 16 },
  grade: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
};
