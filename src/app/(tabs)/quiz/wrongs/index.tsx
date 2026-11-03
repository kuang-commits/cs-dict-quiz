import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { questionById, TYPE_LABEL } from '@/data/questions';
import { WRONG_RETRIES_TO_CLEAR } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';

export default function WrongBookScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const items = Object.entries(data.wrongs)
    .map(([id, entry]) => ({ id, entry, question: questionById[id] }))
    .filter((item) => item.question)
    .sort((left, right) => right.entry.updatedAt - left.entry.updatedAt);

  return (
    <View style={[styles.page, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <T bold style={styles.title}>
          错题本
        </T>
        <T color={theme.muted} style={styles.sub}>
          做错的题会留在这里。同一题连续做对 {WRONG_RETRIES_TO_CLEAR} 次后移出。章节练习里再答对，不会提前移出。
        </T>
      </View>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <T bold style={styles.emptyTitle}>
            还没有错题
          </T>
          <T color={theme.muted} style={styles.emptyBody}>
            去章节练习做几题，错过的会自动出现在这里。
          </T>
          <Pressable onPress={() => router.navigate('/quiz/practice')} style={styles.primary} accessibilityRole="button">
            <T bold color={theme.white}>
              去章节练习
            </T>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.list} testID="wrong-list">
            {items.map((item) => {
              const question = item.question;
              const left = WRONG_RETRIES_TO_CLEAR - item.entry.correctRetries;
              return (
                <View key={item.id} style={styles.card} testID={`wrong-${question.id}`}>
                  <T color={categoryById[question.category].color} style={styles.meta}>
                    {categoryById[question.category].name} · {TYPE_LABEL[question.type]}
                  </T>
                  <T bold style={styles.headline}>
                    {question.headline}
                  </T>
                  <T color={theme.muted} numberOfLines={2}>
                    {question.prompt}
                  </T>
                  <T color={theme.wrong} style={styles.left}>
                    还需连续做对 {left} 次
                  </T>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              onPress={() => router.push('/quiz/wrongs/quiz')}
              style={styles.primary}
              testID="retry-wrongs"
              accessibilityRole="button"
            >
              <T bold color={theme.white}>
                开始重练 {items.length} 题
              </T>
            </Pressable>
          </View>
        </>
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
  sub: {
    lineHeight: 20,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    ...shadow,
    shadowOpacity: 0.04,
  },
  meta: {
    fontSize: 12,
  },
  headline: {
    fontSize: 18,
  },
  left: {
    marginTop: 4,
    fontSize: 13,
  },
  empty: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
  },
  emptyBody: {
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 16,
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
