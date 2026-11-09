import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { codingProblems } from '@/data/coding-problems';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';
import type { CategoryId } from '@/types';

const ORDER: CategoryId[] = ['programming', 'python', 'web'];

export default function CodingListScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data } = useProgress();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 28 }}
      testID="coding-list"
    >
      <View style={{ paddingHorizontal: 20, gap: 6, marginBottom: 8 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <T color={theme.primary}>返回刷题</T>
        </Pressable>
        <T bold style={{ fontSize: 28 }}>
          编程题
        </T>
        <T color={theme.muted}>写出函数 solve(data)。运行只看样例，提交才判隐藏测试。</T>
      </View>
      {ORDER.map((subjectId) => {
        const group = codingProblems.filter((problem) => problem.subjectId === subjectId);
        if (group.length === 0) return null;
        return (
          <View key={subjectId} style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <T bold style={{ marginBottom: 8, marginLeft: 4 }}>
              {categoryById[subjectId].name}
            </T>
            {group.map((problem) => {
              const solved = data.codingSolved.includes(problem.id);
              const wrong = Boolean(data.codingWrongs[problem.id]);
              return (
                <Pressable
                  key={problem.id}
                  onPress={() => router.push(`/quiz/coding/${problem.id}`)}
                  testID={`problem-${problem.id}`}
                  accessibilityRole="button"
                  style={{
                    backgroundColor: theme.card,
                    borderRadius: 16,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: theme.line,
                  }}
                >
                  <T bold style={{ fontSize: 17 }}>
                    {problem.title}
                  </T>
                  <T color={solved ? theme.primary : wrong ? theme.wrong : theme.muted} style={{ marginTop: 4 }}>
                    {solved ? '已通过' : wrong ? '提交未通过' : '未作答'} · {problem.sampleTests.length} 个样例
                  </T>
                  <View testID={`online-badge-${problem.id}`} style={{ alignSelf: 'flex-start', marginTop: 8, backgroundColor: theme.chip, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <T style={{ fontSize: 12 }}>需联网 · Python</T>
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}
