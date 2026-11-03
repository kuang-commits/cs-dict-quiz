import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { CATEGORIES } from '@/data/categories';
import { questionsForCategory } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';

export default function PracticeHome() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const seen = new Set(data.seenQuestionIds);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }}>
      <View style={styles.header}>
        <T bold style={styles.title}>
          章节练习
        </T>
        <T color={theme.muted} style={styles.sub}>
          选一个分类。每屏一道单选题，答完才看对错和解析。
        </T>
      </View>
      <View style={styles.list}>
        {CATEGORIES.map((category) => {
          const chapter = questionsForCategory(category.id);
          const done = chapter.filter((question) => seen.has(question.id)).length;
          return (
            <Pressable
              key={category.id}
              onPress={() => router.push(`/quiz/practice/${category.id}`)}
              testID={`category-${category.id}`}
              accessibilityRole="button"
              style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
            >
              <View style={[styles.mark, { backgroundColor: category.color }]} />
              <View style={styles.body}>
                <T bold style={styles.name}>
                  {category.name}
                </T>
                <T color={theme.muted}>{category.blurb}</T>
                <T color={theme.ink} style={styles.count}>
                  {chapter.length} 题 · 已练 {done}
                </T>
              </View>
              <T color={category.color}>进入</T>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
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
  sub: {
    lineHeight: 20,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    ...shadow,
    shadowOpacity: 0.05,
  },
  mark: {
    width: 10,
    alignSelf: 'stretch' as const,
    borderRadius: 99,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 18,
  },
  count: {
    marginTop: 4,
    fontSize: 13,
  },
};
