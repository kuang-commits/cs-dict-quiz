import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { terms } from '@/data/terms';
import { examPoints } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { shadow, theme as darkFallback, useTheme, useThemeMode } from '@/theme';

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { mode, toggle } = useThemeMode();
  const { data, accuracy, wrongCount, dueCount } = useProgress();
  const learned = data.learnedTermIds.length;
  const vocabCount = Object.keys(data.vocab).length;
  const accuracyText = accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`;

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.bg }]} contentContainerStyle={{ paddingBottom: 28 }} testID="me-screen">
      <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
        <T color="#D7EFE6">学习进度</T>
        <T bold color={theme.white} style={styles.title}>
          我的
        </T>
        <View style={styles.streak}>
          <Ionicons name="flame" size={16} color="#FFD7A1" />
          <T color={theme.white}>{data.streak > 0 ? `连续学习 ${data.streak} 天` : '今天还没刷题'}</T>
        </View>
      </View>
      <Pressable onPress={() => router.navigate('/review')} style={styles.due} testID="review-count" accessibilityRole="button">
        <View>
          <T color={theme.muted}>今日待复习</T>
          <T bold style={styles.dueNumber}>
            {dueCount}
          </T>
        </View>
        <T bold color={theme.primary}>
          去复习
        </T>
      </Pressable>
      <View style={styles.panel}>
        <Stat value={`${learned}/${terms.length}`} label="已学术语" />
        <Stat value={accuracyText} label="正确率" />
        <Stat value={String(wrongCount)} label="错题" />
        <Stat value={String(vocabCount)} label="生词" />
      </View>
      <T color={theme.muted} style={styles.note}>
        累计作答 {data.answered} 题。答对一次，这个术语就记入已学。
        {data.lastExam ? ` 上次模拟考 ${examPoints(data.lastExam)} 分。` : ''}
      </T>
      <Pressable onPress={() => router.push('/subjects')} style={styles.row} testID="open-subjects-me" accessibilityRole="button">
        <T bold>科目</T>
        <T color={theme.muted}>{data.subjectIds.length} 个</T>
      </Pressable>
      <Pressable onPress={toggle} style={styles.row} testID="theme-toggle-me" accessibilityRole="button">
        <T bold>外观</T>
        <T color={theme.muted}>{mode === 'dark' ? '深色' : '浅色'}</T>
      </Pressable>
      <Pressable onPress={() => router.push('/me/vocab')} style={styles.row} testID="open-vocab" accessibilityRole="button">
        <T bold>生词本</T>
        <T color={theme.muted}>{vocabCount} 个</T>
      </Pressable>
      <Pressable onPress={() => router.navigate('/quiz/wrongs')} style={styles.row} accessibilityRole="button">
        <T bold>错题本</T>
        <T color={theme.muted}>{wrongCount} 题</T>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={styles.stat}>
      <T bold style={styles.statValue}>
        {value}
      </T>
      <T color={theme.muted} style={styles.statLabel}>
        {label}
      </T>
    </View>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: darkFallback.bg },
  header: {
    backgroundColor: darkFallback.header,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 6,
  },
  title: { fontSize: 32 },
  streak: {
    marginTop: 8,
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  due: {
    marginHorizontal: 16,
    marginTop: -18,
    backgroundColor: darkFallback.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    ...shadow,
  },
  dueNumber: { fontSize: 36, lineHeight: 42 },
  panel: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: darkFallback.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row' as const,
    ...shadow,
    shadowOpacity: 0.04,
  },
  stat: { flex: 1, gap: 2 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 12 },
  note: { marginHorizontal: 20, marginTop: 12, lineHeight: 20, fontSize: 13 },
  row: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: darkFallback.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    ...shadow,
    shadowOpacity: 0.04,
  },
};
