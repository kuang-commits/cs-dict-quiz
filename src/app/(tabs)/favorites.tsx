import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { TermRow } from '@/components/TermRow';
import { termById } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme } from '@/theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const items = data.favorites.map((id) => termById[id]).filter((term) => term !== undefined);
  const learned = new Set(data.learnedTermIds);

  return (
    <View style={[styles.page, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <T bold style={styles.title}>
          收藏
        </T>
        <T color={theme.muted}>在词条页点星标，就能把词收进来反复看。</T>
      </View>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <T bold style={styles.emptyTitle}>
            还没有收藏
          </T>
          <T color={theme.muted} style={styles.emptyBody}>
            去词典打开一个术语，点「收藏这个词」。
          </T>
          <Pressable onPress={() => router.navigate('/dictionary')} style={styles.button} accessibilityRole="button">
            <T bold color={theme.white}>
              去词典
            </T>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} testID="favorite-list">
          {items.map((term) => (
            <TermRow
              key={term.id}
              term={term}
              learned={learned.has(term.id)}
              onPress={() => router.push(`/dictionary/${term.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 28,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
  },
  emptyBody: {
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.primary,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
