import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { questions } from '@/data/questions';
import { CATALOG, type SubjectLevel } from '@/data/subjects';
import { termIdsForSubject } from '@/state/bank';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';
import type { Question } from '@/types';

const SAMPLE_IDS = ['http:en-to-zh', 'variable:en-to-zh', 'ls:en-to-zh', 'sql:en-to-zh', 'html:en-to-zh'];

export default function PlacementScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data, enrollSubject } = useProgress();
  const samples = useMemo(
    () => SAMPLE_IDS.map((id) => questions.find((question) => question.id === id)).filter((question): question is Question => Boolean(question)),
    [],
  );
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const question = samples[index];
  const done = index >= samples.length;

  const level: SubjectLevel = correct <= 2 ? '入门' : correct <= 4 ? '基础' : '进阶';
  const recommended = CATALOG.filter((subject) => subject.level === level && !data.subjectIds.includes(subject.id));

  function choose(option: number) {
    if (picked !== null || !question) return;
    setPicked(option);
    if (option === question.answerIndex) setCorrect((value) => value + 1);
  }

  function addAll() {
    for (const subject of recommended) {
      enrollSubject(subject.id, termIdsForSubject(subject.id, data.customTerms));
    }
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="placement-screen">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={26} color={theme.ink} />
        </Pressable>
        <T bold>水平测试</T>
      </View>
      {done || !question ? (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          <T bold style={{ fontSize: 28 }}>
            建议从{level}开始
          </T>
          <T color={theme.muted}>
            {samples.length} 题里答对 {correct} 题。下面这些科目还没加入。
          </T>
          {recommended.map((subject) => (
            <T key={subject.id} bold>
              {subject.name}
            </T>
          ))}
          <Pressable onPress={addAll} testID="add-recommended" accessibilityRole="button" style={[styles.button, { backgroundColor: theme.primary }]}>
            <T bold color={theme.bg}>
              加入推荐科目
            </T>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
          <T color={theme.muted}>
            {index + 1} / {samples.length}
          </T>
          <T bold style={{ fontSize: 26 }}>
            {question.headline}
          </T>
          <T>{question.prompt}</T>
          {question.options.map((option, optionIndex) => {
            const show = picked !== null;
            const right = optionIndex === question.answerIndex;
            const backgroundColor = !show ? theme.card : right ? theme.correctBg : optionIndex === picked ? theme.wrongBg : theme.card;
            return (
              <Pressable
                key={option}
                onPress={() => choose(optionIndex)}
                testID={`placement-option-${optionIndex}`}
                accessibilityRole="button"
                style={[styles.option, { backgroundColor, borderColor: theme.line }]}
              >
                <T>{option}</T>
              </Pressable>
            );
          })}
          {picked !== null ? (
            <Pressable
              onPress={() => {
                setPicked(null);
                setIndex((value) => value + 1);
              }}
              testID="placement-next"
              accessibilityRole="button"
              style={[styles.button, { backgroundColor: theme.primary }]}
            >
              <T bold color={theme.bg}>
                {index + 1 === samples.length ? '看推荐' : '下一题'}
              </T>
            </Pressable>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12 },
  option: { borderWidth: 1, borderRadius: 14, padding: 14 },
  button: { minHeight: 48, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
};
