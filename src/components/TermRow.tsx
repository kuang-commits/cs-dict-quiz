import { Pressable, View } from 'react-native';

import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { theme, shadow } from '@/theme';
import type { Term } from '@/types';

export function TermRow({
  term,
  learned = false,
  onPress,
}: {
  term: Term;
  learned?: boolean;
  onPress: () => void;
}) {
  const category = categoryById[term.category];
  return (
    <Pressable
      onPress={onPress}
      testID={`term-${term.id}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={[styles.bar, { backgroundColor: category.color }]} />
      <View style={styles.body}>
        <View style={styles.titleLine}>
          <T bold style={styles.english}>
            {term.english}
          </T>
          <T color={category.color} style={styles.category}>
            {category.name}
          </T>
        </View>
        <T color={theme.primaryDark}>「{term.pronunciation}」</T>
        <View style={styles.meta}>
          <T color={theme.muted} style={styles.chinese}>
            {term.chinese}
          </T>
          {learned ? (
            <T color={theme.primary} style={styles.learned}>
              已学
            </T>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    backgroundColor: theme.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden' as const,
    ...shadow,
    shadowOpacity: 0.05,
  },
  bar: {
    width: 6,
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 2,
  },
  titleLine: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  english: {
    fontSize: 18,
    flex: 1,
  },
  category: {
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  chinese: {
    fontSize: 14,
    flex: 1,
  },
  learned: {
    fontSize: 12,
  },
};
