import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { catalogById } from '@/data/subjects';
import { questions } from '@/data/questions';
import { terms } from '@/data/terms';
import { materializeCustom, termIdsForSubject } from '@/state/bank';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';
import { firstParam } from '@/utils';

export default function SubjectDetailScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const id = firstParam(useLocalSearchParams<{ id: string }>().id);
  const { data, enrollSubject, unenrollSubject } = useProgress();
  const catalog = catalogById[id];
  const custom = data.customSubjects.find((subject) => subject.id === id);
  const name = catalog?.name ?? custom?.name;
  const termIds = termIdsForSubject(id, data.customTerms);
  const termList = termIds.flatMap((termId) => {
    const builtin = terms.find((term) => term.id === termId);
    if (builtin) return [builtin];
    const custom = data.customTerms.find((term) => term.id === termId);
    return custom ? [materializeCustom(custom)] : [];
  });
  const questionCount = catalog
    ? questions.filter((question) => termIds.includes(question.termId)).length
    : termIds.length * 3;
  const enrolled = data.subjectIds.includes(id);

  if (!name) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <T>没有这个科目</T>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="subject-detail">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={26} color={theme.ink} />
        </Pressable>
        <T bold style={{ fontSize: 18, flex: 1 }}>
          {name}
        </T>
      </View>
      <T color={theme.muted} style={{ paddingHorizontal: 16 }}>
        {termList.length} 个术语 · {questionCount} 道题
      </T>
      <Pressable
        onPress={() => (enrolled ? unenrollSubject(id, termIds) : enrollSubject(id, termIds))}
        testID="enroll-subject"
        accessibilityRole="button"
        style={[styles.add, { backgroundColor: enrolled ? theme.card : theme.primary, borderColor: theme.line, borderWidth: enrolled ? 1 : 0 }]}
      >
        <Ionicons name="add" size={18} color={enrolled ? theme.ink : theme.bg} />
        <T bold color={enrolled ? theme.ink : theme.bg}>
          {enrolled ? '已在我的科目' : '添加到我的科目'}
        </T>
      </Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {termList.map((term) => (
          <Pressable
            key={term.id}
            onPress={() => router.push(`/search/${term.id}`)}
            style={[styles.row, { borderBottomColor: theme.line }]}
            accessibilityRole="button"
          >
            <View style={{ flex: 1 }}>
              <T bold>{term.english}</T>
              <T color={theme.muted}>{term.chinese}</T>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.faint} />
          </Pressable>
        ))}
        {custom ? (
          <Pressable onPress={() => router.push(`/subjects/create?subjectId=${id}`)} style={{ padding: 16 }} testID="add-term">
            <T bold color={theme.primary}>
              ＋ 继续添加术语
            </T>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 12, gap: 8 },
  add: {
    margin: 16,
    minHeight: 48,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
};
