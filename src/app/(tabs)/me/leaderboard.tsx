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
        <T color={theme.muted} testID="leaderboard-note">
          本周榜只在本机，带「示例」的是样本对手，不是真人。
        </T>
        {rows.map((row, index) => (
          <View key={row.name} style={{ backgroundColor: row.sample ? theme.card : theme.correctBg, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <T bold>
                {index + 1}. {row.name.replace(/^示例 · /, '')}
              </T>
              {row.sample ? (
                <View testID="sample-badge" style={{ backgroundColor: theme.accent, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <T bold color={theme.bg} style={{ fontSize: 12 }}>
                    示例
                  </T>
                </View>
              ) : null}
            </View>
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
