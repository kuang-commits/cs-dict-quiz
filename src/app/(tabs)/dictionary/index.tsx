import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { TermRow } from '@/components/TermRow';
import { CATEGORIES } from '@/data/categories';
import { searchTerms } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme } from '@/theme';
import type { CategoryId, Term } from '@/types';

export default function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useProgress();
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState<CategoryId | 'all'>('all');
  const learned = useMemo(() => new Set(data.learnedTermIds), [data.learnedTermIds]);

  const sections = useMemo(() => {
    const filtered = searchTerms(query, chip);
    return CATEGORIES.map((category) => ({
      ...category,
      data: filtered.filter((term) => term.category === category.id),
    })).filter((section) => section.data.length > 0);
  }, [query, chip]);

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <T bold style={styles.title}>
          词典
        </T>
        <T color={theme.muted}>英文、中文意思、汉字读音都能搜</T>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={theme.faint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="搜索，例如 HTTP"
          placeholderTextColor={theme.faint}
          autoCapitalize="none"
          autoCorrect={false}
          testID="search-input"
          style={[styles.input, { outlineStyle: 'none' } as object]}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button" hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.faint} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        <Chip label="全部" active={chip === 'all'} onPress={() => setChip('all')} testID="chip-all" />
        {CATEGORIES.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            active={chip === category.id}
            onPress={() => setChip(category.id)}
            testID={`chip-${category.id}`}
          />
        ))}
      </ScrollView>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderSectionHeader={({ section }) => (
          <View style={styles.section}>
            <T bold>{section.name}</T>
            <T color={theme.muted} style={styles.blurb}>
              {section.blurb}
            </T>
          </View>
        )}
        renderItem={({ item }) => (
          <TermRow
            term={item as Term}
            learned={learned.has(item.id)}
            onPress={() => router.push(`/dictionary/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <T color={theme.muted} style={styles.empty}>
            没有找到相关术语，换个词试试。
          </T>
        }
      />
    </View>
  );
}

function Chip({
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
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      style={[styles.chip, active && styles.chipOn]}
    >
      <T bold={active} color={active ? theme.white : theme.ink}>
        {label}
      </T>
    </Pressable>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 2,
  },
  title: {
    fontSize: 28,
  },
  searchBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    minHeight: 46,
    paddingHorizontal: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: theme.font,
    fontSize: 16,
    color: theme.ink,
    paddingVertical: 8,
  },
  chipScroll: {
    flexGrow: 0,
    marginTop: 12,
  },
  chips: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: theme.chip,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipOn: {
    backgroundColor: theme.primary,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: 8,
  },
  blurb: {
    fontSize: 12,
  },
  empty: {
    textAlign: 'center' as const,
    marginTop: 40,
    paddingHorizontal: 24,
  },
};
