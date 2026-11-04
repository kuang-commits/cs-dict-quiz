import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { questionById } from '@/data/questions';
import { formatClock } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';

export default function LessonResultScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { lesson } = useProgress();

  if (!lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <T>还没有本次成绩</T>
      </View>
    );
  }

  const accuracy = lesson.total === 0 ? 0 : Math.round((lesson.correct / lesson.total) * 100);
  const mistakes = lesson.mistakeIds.map((id) => questionById[id]).filter((question) => question);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="lesson-result">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        <T color={theme.muted}>{lesson.title} 完成</T>
        <T bold style={{ fontSize: 28 }}>
          本节成绩
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }} testID="lesson-stars">
          {[1, 2, 3].map((star) => (
            <T key={star} style={{ fontSize: 36 }} color={star <= lesson.stars ? '#F0A05A' : theme.faint}>
              ★
            </T>
          ))}
        </View>
        <T bold style={{ fontSize: 42 }} testID="lesson-xp">
          +{lesson.xp} XP
        </T>
        <T>
          正确率 {accuracy}% · 用时 {formatClock(lesson.seconds)} · 剩余爱心 {lesson.heartsLeft}
        </T>
        <T color={theme.muted}>1 星 60%，2 星 80%，3 星全对。全对另加 30 XP。</T>
        <T bold>答错的题</T>
        {mistakes.length === 0 ? (
          <T color={theme.muted}>本节没有答错。</T>
        ) : (
          mistakes.map((question) => (
            <View key={question.id} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12 }}>
              <T bold>{question.headline}</T>
              <T color={theme.muted}>{question.prompt}</T>
            </View>
          ))
        )}
        <Pressable onPress={() => router.push('/quiz/wrongs')} testID="result-wrongs" accessibilityRole="button" style={{ backgroundColor: theme.card, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.line }}>
          <T bold>去错题本</T>
        </Pressable>
        <Pressable onPress={() => router.replace('/me')} testID="result-home" accessibilityRole="button" style={{ backgroundColor: theme.primary, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center' }}>
          <T bold color={theme.bg}>
            回我的主页
          </T>
        </Pressable>
      </ScrollView>
    </View>
  );
}
