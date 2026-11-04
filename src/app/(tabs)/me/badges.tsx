import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { useProgress } from '@/state/progress';
import { ACHIEVEMENTS } from '@/state/scoring';
import { useTheme } from '@/theme';

export default function BadgesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data } = useProgress();
  const owned = new Set(data.achievements);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="badges">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={theme.ink} />
        </Pressable>
        <T bold style={{ fontSize: 18 }}>成就</T>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {ACHIEVEMENTS.map((badge) => {
          const on = owned.has(badge.id);
          return (
            <View key={badge.id} style={{ backgroundColor: theme.card, borderRadius: 14, padding: 14, gap: 4, opacity: on ? 1 : 0.55 }}>
              <T bold>{on ? '已获得' : '未获得'} · {badge.name}</T>
              <T color={theme.muted}>{badge.detail}</T>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12 },
};
