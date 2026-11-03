import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { useProgress } from '@/state/progress';
import { shadow, theme as darkFallback, useTheme } from '@/theme';

export default function QuizHome() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { wrongCount, accuracy, data } = useProgress();
  const accuracyText = accuracy === null ? '还没开始' : `正确率 ${Math.round(accuracy * 100)}%`;

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 28 }}
      testID="quiz-home"
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
        <T bold style={styles.title}>
          刷题
        </T>
        <T color={theme.muted}>一题一屏。答完才看对错和解析。{accuracyText}，已做 {data.answered} 题。</T>
        </View>
        <Pressable onPress={() => router.push('/subjects')} testID="open-subjects" accessibilityRole="button" style={[styles.subjectButton, { borderColor: theme.line }]}>
          <Ionicons name="add" size={18} color={theme.primary} />
          <T bold color={theme.primary}>科目</T>
        </Pressable>
      </View>
      <Pressable
        onPress={() => router.push('/quiz/practice')}
        testID="open-practice"
        accessibilityRole="button"
        style={styles.card}
      >
        <Icon name="list" color={theme.primary} />
        <View style={styles.copy}>
          <T bold style={styles.cardTitle}>
            章节练习
          </T>
          <T color={theme.muted}>按网络、编程、数据库等分类刷</T>
        </View>
      </Pressable>
      <Pressable onPress={() => router.push('/exam')} testID="open-exam" accessibilityRole="button" style={styles.card}>
        <Icon name="timer" color={theme.accent} />
        <View style={styles.copy}>
          <T bold style={styles.cardTitle}>
            模拟考试
          </T>
          <T color={theme.muted}>随机 20 题，限时 10 分钟</T>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push('/quiz/wrongs')}
        testID="open-wrongs"
        accessibilityRole="button"
        style={styles.card}
      >
        <Icon name="refresh" color={theme.wrong} />
        <View style={styles.copy}>
          <T bold style={styles.cardTitle}>
            错题本
          </T>
          <T color={theme.muted}>{wrongCount > 0 ? `${wrongCount} 题待重练` : '错过的题会留在这里'}</T>
        </View>
      </Pressable>
    </ScrollView>
  );
}

function Icon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.icon, { backgroundColor: color }]}>
      <Ionicons name={name} color={theme.bg} size={18} />
    </View>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: darkFallback.bg },
  headerRow: { paddingHorizontal: 20, gap: 8, marginBottom: 12, flexDirection: 'row' as const, alignItems: 'center' as const },
  subjectButton: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  title: { fontSize: 28 },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: darkFallback.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    ...shadow,
    shadowOpacity: 0.05,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  copy: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 18 },
};
