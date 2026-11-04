import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { useProgress } from '@/state/progress';
import { SAMPLE_RIVALS } from '@/state/scoring';
import { useTheme } from '@/theme';

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data } = useProgress();
  const rows = [
    ...SAMPLE_RIVALS.map((rival) => ({ name: rival.name, weeklyXp: rival.weeklyXp, sample: true })),
    { name: '我', weeklyXp: data.weeklyXp, sample: false },
  ].sort((left, right) => right.weeklyXp - left.weeklyXp || Number(left.sample) - Number(right.sample));

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="leaderboard">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={theme.ink} />
        </Pressable>
        <T bold style={{ fontSize: 18 }}>本周排行</T>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <T color={theme.muted}>
          这里的对手都是写在本机的示例，名字前标了「示例」。没有服务器，也不会上传你的成绩。每周一经验重新计算。
        </T>
        {rows.map((row, index) => (
          <View key={row.name} style={{ backgroundColor: row.sample ? theme.card : theme.correctBg, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
            <T bold>{index + 1}. {row.name}</T>
            <T>{row.weeklyXp} XP</T>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12 },
};
