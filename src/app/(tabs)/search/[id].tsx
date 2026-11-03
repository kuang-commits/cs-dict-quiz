import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { categoryById } from '@/data/categories';
import { termById } from '@/data/questions';
import { useProgress } from '@/state/progress';
import { theme, shadow } from '@/theme';
import { firstParam } from '@/utils';

export default function TermCardScreen() {
  const insets = useSafeAreaInsets();
  const id = firstParam(useLocalSearchParams<{ id: string }>().id);
  const term = termById[id];
  const { data, toggleVocab } = useProgress();
  const [voice, setVoice] = useState<'uk' | 'us' | null>(null);

  if (!term) {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]}>
        <T>没有这个术语</T>
        <Pressable onPress={() => router.back()} style={styles.practice}>
          <T bold color={theme.white}>
            返回
          </T>
        </Pressable>
      </View>
    );
  }

  const category = categoryById[term.category];
  const saved = Boolean(data.vocab[term.id]);
  const learned = data.learnedTermIds.includes(term.id);

  function speak(kind: 'uk' | 'us') {
    setVoice(kind);
    const language = kind === 'uk' ? 'en-GB' : 'en-US';
    try {
      void Speech.stop();
      Speech.speak(term.english, {
        language,
        rate: 0.92,
        onDone: () => setVoice(null),
        onError: () => setVoice(null),
      });
    } catch {
      setVoice(null);
    }
  }

  return (
    <View style={[styles.page, { paddingTop: insets.top }]} testID="term-card">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} testID="back-button" accessibilityRole="button">
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
          <T>返回</T>
        </Pressable>
        <Pressable
          onPress={() => toggleVocab(term.id)}
          testID="vocab-button"
          accessibilityRole="button"
          style={styles.vocab}
        >
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? theme.primary : theme.ink} />
          <T bold color={saved ? theme.primary : theme.ink}>
            {saved ? '已在生词本' : '加入生词本'}
          </T>
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll}>
        <T color={category.color}>{category.name}</T>
        <T bold style={styles.headword}>
          {term.english}
        </T>
        <View style={styles.posRow}>
          <View style={styles.pos}>
            <T color={theme.primaryDark}>{term.partOfSpeech}</T>
          </View>
          <T color={learned ? theme.primary : theme.muted} style={styles.learned}>
            {learned ? '刷题里答对过' : '答对一次后记入已学'}
          </T>
        </View>
        <View style={styles.soundRow}>
          <SoundButton label="英" active={voice === 'uk'} onPress={() => speak('uk')} testID="speak-uk" />
          <SoundButton label="美" active={voice === 'us'} onPress={() => speak('us')} testID="speak-us" />
          <View style={styles.pill}>
            <T color={theme.primaryDark}>「{term.pronunciation}」</T>
          </View>
        </View>
        <T bold style={styles.meaning}>
          {term.chinese}
        </T>

        <View style={styles.block}>
          <T bold>释义</T>
          <T style={styles.body}>{term.explanation}</T>
        </View>
        <View style={styles.block}>
          <T bold>例句</T>
          {term.examples.map((sentence, index) => (
            <View key={sentence.english} style={styles.example}>
              <T bold color={theme.faint}>
                {index + 1}
              </T>
              <View style={styles.exampleBody}>
                <T style={styles.body}>{sentence.english}</T>
                <T color={theme.muted}>{sentence.chinese}</T>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.block} testID="related-block">
          <T bold>相关词</T>
          <View style={styles.chips}>
            {term.related.map((relatedId) => {
              const related = termById[relatedId];
              if (!related) return null;
              return (
                <Pressable
                  key={relatedId}
                  onPress={() => router.push(`/search/${relatedId}`)}
                  testID={`related-${relatedId}`}
                  accessibilityRole="button"
                  style={styles.chip}
                >
                  <T bold>{related.english}</T>
                  <T color={theme.muted} style={styles.chipZh}>
                    {related.chinese}
                  </T>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.navigate(`/quiz/practice/${term.category}`)}
          testID="go-practice"
          accessibilityRole="button"
          style={styles.practice}
        >
          <T bold color={theme.white}>
            去「{category.name}」章节练习
          </T>
        </Pressable>
      </View>
    </View>
  );
}

function SoundButton({
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
      style={[styles.sound, active && styles.soundOn]}
    >
      <Ionicons name="volume-medium" size={16} color={active ? theme.white : theme.primaryDark} />
      <T bold color={active ? theme.white : theme.primaryDark}>
        {label}
      </T>
    </Pressable>
  );
}

const styles = {
  page: { flex: 1, backgroundColor: theme.bg },
  center: { alignItems: 'center' as const, justifyContent: 'center' as const, gap: 12 },
  top: {
    paddingHorizontal: 12,
    minHeight: 48,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  back: { flexDirection: 'row' as const, alignItems: 'center' as const, minHeight: 40 },
  vocab: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, paddingHorizontal: 8 },
  scroll: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  scrollView: { flex: 1, overflow: 'hidden' as const },
  headword: { fontSize: 36, lineHeight: 44 },
  posRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  pos: {
    borderWidth: 1,
    borderColor: '#B7D8CC',
    backgroundColor: '#E7F3EE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  learned: { fontSize: 12 },
  soundRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, flexWrap: 'wrap' as const },
  sound: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#B7D8CC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.card,
  },
  soundOn: { backgroundColor: theme.primary, borderColor: theme.primary },
  pill: { backgroundColor: '#E7F3EE', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  meaning: { fontSize: 22, lineHeight: 30 },
  block: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 12,
    gap: 6,
    ...shadow,
    shadowOpacity: 0.04,
  },
  body: { fontSize: 16, lineHeight: 24 },
  example: { flexDirection: 'row' as const, gap: 8 },
  exampleBody: { flex: 1, gap: 2 },
  chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8 },
  chip: {
    backgroundColor: theme.chip,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  chipZh: { fontSize: 12 },
  footer: { paddingHorizontal: 20, paddingBottom: 12 },
  practice: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 16,
  },
};
