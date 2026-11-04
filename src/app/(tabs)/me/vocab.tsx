import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { termById } from '@/data/questions';
import { dateKey } from '@/state/logic';
import { useProgress } from '@/state/progress';
import { theme } from '@/theme';

type SortMode = 'time' | 'alpha';

export default function VocabScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const [sortMode, setSortMode] = useState<SortMode>('time');
  const today = dateKey(new Date());
  const items = useMemo(() => {
    const rows = Object.entries(data.vocab)
      .map(([id, card]) => ({ id, card, term: termById[id] }))
      .filter((item) => item.term);
    if (sortMode === 'alpha') {
      rows.sort((left, right) => left.term.english.localeCompare(right.term.english));
    } else {
      rows.sort((left, right) => right.card.addedAt - left.card.addedAt);
    }
    return rows;
  }, [data.vocab, sortMode]);

  return (
    <View style={[styles.page, { paddingTop: insets.top }]} testID="vocab-screen">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
          <T>返回</T>
        </Pressable>
        <T bold style={styles.title}>
          生词本
        </T>
        <View style={styles.back} />
      </View>
      <View style={styles.sorts}>
        <Sort label="按时间" active={sortMode === 'time'} onPress={() => setSortMode('time')} testID="sort-time" />
        <Sort label="按字母" active={sortMode === 'alpha'} onPress={() => setSortMode('alpha')} testID="sort-alpha" />
      </View>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <T bold>生词本是空的</T>
          <T color={theme.muted}>在词卡右上角点「加入生词本」。</T>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/search/${item.id}`)}
              style={styles.row}
              testID={`vocab-${item.id}`}
              accessibilityRole="button"
            >
              <View style={styles.rowMain}>
                <T bold style={styles.word}>
                  {item.term.english}
                </T>
                <T color={theme.muted}>{item.term.chinese}</T>
              </View>
              <T color={item.card.due <= today ? theme.accent : theme.faint} style={styles.due}>
                {item.card.due <= today ? '今日复习' : item.card.due.slice(5)}
              </T>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function Sort({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button" style={[styles.sort, active && styles.sortOn]}>
      <T bold color={active ? theme.white : theme.ink}>
        {label}
      </T>
    </Pressable>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: theme.bg },
  top: {
    minHeight: 48,
    paddingHorizontal: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  back: { width: 72, flexDirection: 'row' as const, alignItems: 'center' as const },
  title: { fontSize: 18 },
  sorts: { flexDirection: 'row' as const, gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  sort: { backgroundColor: theme.chip, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  sortOn: { backgroundColor: theme.primary },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  rowMain: { flex: 1, gap: 2 },
  word: { fontSize: 18 },
  due: { fontSize: 12 },
  empty: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 6 },
};
