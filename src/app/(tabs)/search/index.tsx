import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { suggestTerms } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme } from '@/theme';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { data, rememberSearch, clearSearchHistory } = useProgress();
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => suggestTerms(query, 8), [query]);
  const typing = query.trim().length > 0;

  function openTerm(id: string) {
    rememberSearch(query.trim() || id);
    router.push(`/search/${id}`);
  }

  return (
    <View style={[styles.page, { paddingTop: insets.top + 8 }]} testID="search-screen">
      <View style={styles.header}>
        <T bold style={styles.title}>
          查词
        </T>
        <T color={theme.muted}>输入英文或中文，马上出词条</T>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={theme.faint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="搜索，例如 HTTP 或 超文本"
          placeholderTextColor={theme.faint}
          autoCapitalize="none"
          autoCorrect={false}
          testID="search-input"
          style={[styles.input, { outlineStyle: 'none' } as object]}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button" hitSlop={8} testID="clear-query">
            <Ionicons name="close-circle" size={18} color={theme.faint} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
        {typing ? (
          suggestions.length === 0 ? (
            <T color={theme.muted} style={styles.empty}>
              没有接近的词，换个拼法试试。
            </T>
          ) : (
            suggestions.map((term) => (
              <Pressable
                key={term.id}
                onPress={() => openTerm(term.id)}
                testID={`suggestion-${term.id}`}
                accessibilityRole="button"
                style={styles.suggest}
              >
                <View style={styles.suggestMain}>
                  <T bold style={styles.word}>
                    {term.english}
                  </T>
                  <T color={theme.faint} style={styles.pos}>
                    {term.partOfSpeech}
                  </T>
                </View>
                <T color={theme.muted} numberOfLines={1} style={styles.meaning}>
                  {term.chinese}
                </T>
              </Pressable>
            ))
          )
        ) : (
          <View>
            <View style={styles.historyHead}>
              <T bold>搜索历史</T>
              {data.searchHistory.length > 0 ? (
                <Pressable onPress={clearSearchHistory} testID="clear-history" accessibilityRole="button">
                  <T color={theme.primary}>清空</T>
                </Pressable>
              ) : null}
            </View>
            {data.searchHistory.length === 0 ? (
              <T color={theme.muted}>还没有搜索记录。查过的词会留在这里。</T>
            ) : (
              data.searchHistory.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setQuery(item)}
                  style={styles.historyRow}
                  testID={`history-${item}`}
                  accessibilityRole="button"
                >
                  <Ionicons name="time-outline" size={16} color={theme.faint} />
                  <T>{item}</T>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: theme.bg },
  header: { paddingHorizontal: 20, gap: 2 },
  title: { fontSize: 28 },
  searchBox: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    minHeight: 48,
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
    paddingVertical: 10,
  },
  list: { padding: 16, paddingTop: 8, gap: 0 },
  suggest: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    gap: 2,
  },
  suggestMain: { flexDirection: 'row' as const, alignItems: 'baseline' as const, gap: 8 },
  word: { fontSize: 18 },
  pos: { fontSize: 12 },
  meaning: { fontSize: 14 },
  empty: { marginTop: 24, textAlign: 'center' as const },
  historyHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
};
