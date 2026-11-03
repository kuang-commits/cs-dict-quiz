import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { catalogById } from '@/data/subjects';
import { useBank, termIdsForSubject } from '@/state/bank';
import { useProgress } from '@/state/progress';
import { shadow, theme as darkFallback, useTheme } from '@/theme';

export default function PracticeHome() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data } = useProgress();
  const { activeQuestions } = useBank();
  const seen = new Set(data.seenQuestionIds);
  const chapters = data.subjectIds.map((id) => {
    const meta = catalogById[id];
    const custom = data.customSubjects.find((subject) => subject.id === id);
    const ids = new Set(termIdsForSubject(id, data.customTerms));
    const chapter = activeQuestions.filter((question) => ids.has(question.termId));
    return { id, name: meta?.name ?? custom?.name ?? id, blurb: meta?.blurb ?? '自己添加的术语', color: theme.primary, chapter };
  });

  return (
    <ScrollView style={[styles.page, { backgroundColor: theme.bg }]} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 24 }} testID="chapter-list">
      <View style={styles.header}>
        <T bold style={styles.title}>
          章节练习
        </T>
        <T color={theme.muted} style={styles.sub}>
          只刷已添加的科目。每屏一道单选题，答完才看对错和解析。
        </T>
      </View>
      {chapters.length === 0 ? (
        <View style={{ padding: 24, gap: 12 }}>
          <T>还没有科目。先添加一个，这里才会出现章节。</T>
          <Pressable onPress={() => router.push('/subjects')} testID="chapters-add-subject" accessibilityRole="button" style={styles.card}>
            <T bold color={theme.primary}>去添加科目</T>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.list}>
        {chapters.map((category) => {
          const done = category.chapter.filter((question) => seen.has(question.id)).length;
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
                  {category.chapter.length} 题 · 已练 {done}
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
    backgroundColor: darkFallback.bg,
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
    backgroundColor: darkFallback.card,
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
