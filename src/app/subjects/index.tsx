import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { CATALOG } from '@/data/subjects';
import { questions } from '@/data/questions';
import { terms } from '@/data/terms';
import { termIdsForSubject } from '@/state/bank';
import { useProgress } from '@/state/progress';
import { useTheme, useThemeMode } from '@/theme';

type Tab = 'mine' | 'library' | 'custom';

export default function SubjectsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { toggle } = useThemeMode();
  const { data } = useProgress();
  const [tab, setTab] = useState<Tab>('library');
  const [query, setQuery] = useState('');
  const folded = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const builtin = CATALOG.map((subject) => {
      const ids = termIdsForSubject(subject.id, data.customTerms);
      const questionCount = questions.filter((question) => ids.includes(question.termId)).length;
      return { id: subject.id, name: subject.name, blurb: subject.blurb, terms: ids.length, questions: questionCount, level: subject.level };
    });
    const custom = data.customSubjects.map((subject) => {
      const ids = termIdsForSubject(subject.id, data.customTerms);
      return { id: subject.id, name: subject.name, blurb: '自己添加的术语', terms: ids.length, questions: ids.length * 3, level: '自建' };
    });
    const source = tab === 'mine' ? [...builtin, ...custom].filter((row) => data.subjectIds.includes(row.id)) : tab === 'custom' ? custom : builtin;
    return source.filter((row) => !folded || row.name.toLowerCase().includes(folded) || row.blurb.includes(query.trim()));
  }, [tab, folded, query, data.customSubjects, data.customTerms, data.subjectIds]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="subjects-screen">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} testID="subjects-back" accessibilityRole="button">
          <Ionicons name="chevron-back" size={26} color={theme.ink} />
        </Pressable>
        <View style={[styles.search, { backgroundColor: theme.card, borderColor: theme.line }]}>
          <Ionicons name="search" size={16} color={theme.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="搜索科目"
            placeholderTextColor={theme.faint}
            testID="subject-search"
            style={{ flex: 1, color: theme.ink, fontFamily: theme.font, fontSize: 15, paddingVertical: 8 }}
          />
        </View>
        <Pressable onPress={toggle} hitSlop={8} testID="theme-toggle" accessibilityRole="button">
          <Ionicons name="contrast" size={20} color={theme.ink} />
        </Pressable>
      </View>
      <View style={styles.tabs}>
        <Seg label="我的科目" active={tab === 'mine'} onPress={() => setTab('mine')} testID="tab-mine" />
        <Seg label="科目库" active={tab === 'library'} onPress={() => setTab('library')} testID="tab-library" />
        <Seg label="自建" active={tab === 'custom'} onPress={() => setTab('custom')} testID="tab-custom" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 10 }}>
        {tab === 'library' ? (
          <View style={[styles.promo, { backgroundColor: theme.card, borderColor: theme.line }]}>
            <T bold style={{ fontSize: 18 }}>
              按水平推荐科目
            </T>
            <T color={theme.muted}>做几道题，按对错推荐入门、基础或进阶科目。</T>
            <Pressable
              onPress={() => router.push('/subjects/placement')}
              testID="start-placement"
              accessibilityRole="button"
              style={[styles.promoButton, { backgroundColor: theme.primary }]}
            >
              <T bold color={theme.bg}>
                开始测试
              </T>
            </Pressable>
          </View>
        ) : null}
        {rows.length === 0 ? (
          <T color={theme.muted} style={{ textAlign: 'center', marginTop: 24 }}>
            {tab === 'mine' ? '还没有科目。到科目库添加，或点右下角自己建。' : '没有匹配的科目。'}
          </T>
        ) : (
          rows.map((row) => (
            <Pressable
              key={row.id}
              onPress={() => router.push(`/subjects/${row.id}`)}
              testID={`subject-${row.id}`}
              accessibilityRole="button"
              style={[styles.row, { borderBottomColor: theme.line }]}
            >
              <View style={{ flex: 1, gap: 3 }}>
                <T bold style={{ fontSize: 17 }}>
                  {row.name}
                </T>
                <T color={theme.muted} style={{ fontSize: 13 }}>
                  {row.level} · {row.terms} 词 · {row.questions} 题
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.faint} />
            </Pressable>
          ))
        )}
      </ScrollView>
      <Pressable
        onPress={() => router.push('/subjects/create')}
        testID="create-subject"
        accessibilityRole="button"
        style={[styles.plus, { backgroundColor: theme.primary, bottom: insets.bottom + 18 }]}
      >
        <Ionicons name="add" size={30} color={theme.bg} />
      </Pressable>
    </View>
  );
}

function Seg({ label, active, onPress, testID }: { label: string; active: boolean; onPress: () => void; testID: string }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button" style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
      <T bold color={active ? theme.primary : theme.muted}>
        {label}
      </T>
      <View style={{ height: 2, width: 28, marginTop: 6, backgroundColor: active ? theme.primary : 'transparent' }} />
    </Pressable>
  );
}

const styles = {
  top: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12, paddingBottom: 4 },
  search: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  tabs: { flexDirection: 'row' as const, paddingHorizontal: 8 },
  promo: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  promoButton: { marginTop: 4, borderRadius: 12, minHeight: 42, alignItems: 'center' as const, justifyContent: 'center' as const },
  row: { minHeight: 64, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, borderBottomWidth: 1 },
  plus: {
    position: 'absolute' as const,
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
