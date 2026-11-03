import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { terms } from '@/data/terms';
import { examPoints } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, accuracy, wrongCount } = useProgress();
  const learned = data.learnedTermIds.length;
  const accuracyText = accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`;

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 28 }} testID="home-screen">
      <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
        <View style={styles.orb} />
        <T color="#D7EFE6" style={styles.kicker}>
          驾考式刷题
        </T>
        <T bold color={theme.white} style={styles.title}>
          计算机词典刷题
        </T>
        <T color="#E7F6F1" style={styles.subtitle}>
          把计算机英语，刷到能看懂
        </T>
        <View style={styles.streak}>
          <Ionicons name="flame" size={16} color="#FFD7A1" />
          <T color={theme.white}>
            {data.streak > 0 ? `连续学习 ${data.streak} 天` : '今天还没开始练'}
          </T>
        </View>
      </View>

      <View style={styles.panel}>
        <T bold style={styles.panelTitle}>
          学习进度
        </T>
        <View style={styles.stats}>
          <Stat value={`${learned}/${terms.length}`} label="已学术语" />
          <Stat value={accuracyText} label="正确率" />
          <Stat value={String(wrongCount)} label="错题" />
          <Stat value={String(data.favorites.length)} label="收藏" />
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(learned / terms.length) * 100}%` }]} />
        </View>
        <T color={theme.muted} style={styles.note}>
          累计作答 {data.answered} 题。答对一次，这个术语就记入已学。
        </T>
        {data.lastExam ? (
          <T color={theme.primaryDark} style={styles.lastExam}>
            上次模拟考 {examPoints(data.lastExam)} 分 · 答对 {data.lastExam.correct}/{data.lastExam.total}
          </T>
        ) : null}
      </View>

      <T bold style={styles.section}>
        今天练什么
      </T>
      <View style={styles.grid}>
        <Action
          testID="open-practice"
          icon="checkbox"
          color={theme.primary}
          title="章节练习"
          body="按分类，一题一屏"
          onPress={() => router.navigate('/practice')}
        />
        <Action
          testID="open-exam"
          icon="timer"
          color={theme.accent}
          title="模拟考试"
          body="20 题，限时 10 分钟"
          onPress={() => router.push('/exam')}
        />
      </View>
      <View style={styles.grid}>
        <Action
          testID="open-wrongs"
          icon="refresh"
          color={theme.wrong}
          title="错题本"
          body={wrongCount > 0 ? `${wrongCount} 题待重练` : '错过的题会留在这'}
          onPress={() => router.navigate('/wrongs')}
        />
        <Action
          testID="open-favorites"
          icon="star"
          color="#B8860B"
          title="我的收藏"
          body={data.favorites.length > 0 ? `${data.favorites.length} 个术语` : '星标想反复看的词'}
          onPress={() => router.navigate('/favorites')}
        />
      </View>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
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

function Action({
  icon,
  color,
  title,
  body,
  onPress,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  body: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.icon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={theme.white} />
      </View>
      <T bold style={styles.actionTitle}>
        {title}
      </T>
      <T color={theme.muted} style={styles.actionBody}>
        {body}
      </T>
    </Pressable>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    backgroundColor: theme.header,
    paddingHorizontal: 22,
    paddingBottom: 36,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden' as const,
  },
  orb: {
    position: 'absolute' as const,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -40,
    top: -30,
  },
  kicker: {
    fontSize: 13,
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    marginTop: 6,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
  },
  streak: {
    marginTop: 16,
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  panel: {
    marginHorizontal: 16,
    marginTop: -22,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 16,
    ...shadow,
  },
  panelTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row' as const,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
  },
  track: {
    marginTop: 14,
    height: 8,
    borderRadius: 99,
    backgroundColor: theme.chip,
    overflow: 'hidden' as const,
  },
  fill: {
    height: 8,
    backgroundColor: theme.primary,
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  lastExam: {
    marginTop: 8,
    fontSize: 13,
  },
  section: {
    marginTop: 22,
    marginBottom: 10,
    marginHorizontal: 20,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row' as const,
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  action: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    gap: 6,
    minHeight: 118,
    ...shadow,
    shadowOpacity: 0.05,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  actionTitle: {
    fontSize: 16,
  },
  actionBody: {
    fontSize: 12,
    lineHeight: 17,
  },
};
