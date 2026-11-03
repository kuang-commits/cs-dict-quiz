import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { termById } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';
import { firstParam } from '@/utils';

export default function TermDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = firstParam(params.id);
  const term = termById[id];
  const { data, toggleFavorite } = useProgress();

  if (!term) {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]}>
        <T>没有这个术语</T>
        <Pressable onPress={() => router.back()} style={styles.primary}>
          <T bold color={theme.white}>
            返回
          </T>
        </Pressable>
      </View>
    );
  }

  const category = categoryById[term.category];
  const saved = data.favorites.includes(term.id);
  const learned = data.learnedTermIds.includes(term.id);

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} testID="back-button" accessibilityRole="button">
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
          <T>返回</T>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
        <T bold color={category.color}>
          {category.name}
        </T>
        <T bold style={styles.english}>
          {term.english}
        </T>
        <View style={styles.pill}>
          <T color={theme.primaryDark} style={styles.pronunciation}>
            「{term.pronunciation}」
          </T>
        </View>
        <T bold style={styles.chinese}>
          {term.chinese}
        </T>
        <T color={learned ? theme.primary : theme.muted} style={styles.learned}>
          {learned ? '练习里答对过，已记入已学' : '在练习里答对一次，就算学过这个词'}
        </T>

        <Pressable
          onPress={() => toggleFavorite(term.id)}
          testID="favorite-button"
          accessibilityRole="button"
          style={styles.favorite}
        >
          <Ionicons name={saved ? 'star' : 'star-outline'} size={18} color={saved ? '#B8860B' : theme.ink} />
          <T bold>{saved ? '已收藏' : '收藏这个词'}</T>
        </Pressable>

        <View style={styles.block}>
          <T bold>解释</T>
          <T style={styles.body}>{term.explanation}</T>
        </View>
        <View style={styles.block}>
          <T bold>例句</T>
          <T style={styles.body}>{term.example}</T>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.navigate(`/practice/${term.category}`)}
          testID="go-practice"
          accessibilityRole="button"
          style={styles.primary}
        >
          <T bold color={theme.white}>
            去「{category.name}」章节练习
          </T>
        </Pressable>
      </View>
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
    gap: 16,
  },
  top: {
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center' as const,
  },
  back: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    minHeight: 40,
    paddingRight: 8,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 8,
  },
  english: {
    fontSize: 40,
    lineHeight: 48,
  },
  pill: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#E7F3EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pronunciation: {
    fontSize: 16,
  },
  chinese: {
    fontSize: 22,
    marginTop: 4,
  },
  learned: {
    fontSize: 13,
  },
  favorite: {
    marginTop: 8,
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: theme.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  block: {
    marginTop: 8,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    ...shadow,
    shadowOpacity: 0.04,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  primary: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 16,
  },
};
