import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View, type ScrollViewInstance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { T } from '@/components/Text';
import { TYPE_LABEL } from '@/data/questions';
import { theme, shadow } from '@/theme';
import type { Question } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D'];

type Props = {
  question: Question;
  index: number;
  total: number;
  kicker: string;
  onAnswer: (choice: number) => void;
  onNext: () => void;
  nextLabel: string;
  extraNote?: string | null;
  onBack?: () => void;
  backLabel?: string;
  headerRight?: React.ReactNode;
  toolbar?: React.ReactNode;
};

export function QuestionCard({
  question,
  index,
  total,
  kicker,
  onAnswer,
  onNext,
  nextLabel,
  extraNote,
  onBack,
  backLabel = '返回',
  headerRight,
  toolbar,
}: Props) {
  const [chosen, setChosen] = useState<number | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const answered = chosen !== null;
  const correct = chosen === question.answerIndex;

  useEffect(() => {
    if (!answered) return;
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 40);
    return () => clearTimeout(timer);
  }, [answered]);

  function choose(optionIndex: number) {
    if (answered) return;
    setChosen(optionIndex);
    onAnswer(optionIndex);
  }

  return (
    <View style={{ flex: 1 }} testID="question-card">
      <View style={styles.topBar}>
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          hitSlop={8}
          style={styles.side}
          testID="back-button"
          accessibilityRole="button"
        >
          {onBack ? (
            <>
              {backLabel === '返回' ? <Ionicons name="chevron-back" size={20} color={theme.ink} /> : null}
              <T color={backLabel === '交卷' ? theme.wrong : theme.ink}>{backLabel}</T>
            </>
          ) : null}
        </Pressable>
        <T bold numberOfLines={1} style={styles.kicker}>
          {kicker}
        </T>
        <View style={[styles.side, styles.sideRight]}>{headerRight}</View>
      </View>
      {toolbar}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(index / total) * 100}%` }]} />
      </View>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <T color={theme.muted} style={styles.count}>
          第 {index + 1} / {total} 题 · {TYPE_LABEL[question.type]}
        </T>
        <T bold style={question.type === 'fill-in' ? styles.smallHeadline : styles.headline}>
          {question.headline}
        </T>
        {question.pronunciation ? (
          <View style={styles.pill}>
            <T color={theme.primaryDark}>「{question.pronunciation}」</T>
          </View>
        ) : null}
        <RichPrompt text={question.prompt} />
        {question.helper ? (
          <T color={theme.muted} style={styles.helper}>
            {question.helper}
          </T>
        ) : null}
        {answered ? (
          <View
            style={[styles.banner, { backgroundColor: correct ? theme.correctBg : theme.wrongBg }]}
            testID="answer-banner"
          >
            <T bold color={correct ? theme.correct : theme.wrong}>
              {correct ? '回答正确' : '回答错误'}
            </T>
            <T style={styles.bannerAnswer}>
              正确答案：{question.options[question.answerIndex]}
            </T>
            {extraNote ? <T color={theme.muted}>{extraNote}</T> : null}
          </View>
        ) : null}
        <View style={styles.options}>
          {question.options.map((option, optionIndex) => {
            const isCorrect = answered && optionIndex === question.answerIndex;
            const isWrongPick = answered && optionIndex === chosen && !correct;
            const backgroundColor = isCorrect ? theme.correctBg : isWrongPick ? theme.wrongBg : theme.card;
            const borderColor = isCorrect ? theme.correct : isWrongPick ? theme.wrong : theme.line;
            const letterBg = isCorrect ? theme.correct : isWrongPick ? theme.wrong : theme.chip;
            const letterColor = isCorrect || isWrongPick ? theme.white : theme.ink;
            return (
              <Pressable
                key={option}
                onPress={() => choose(optionIndex)}
                disabled={answered}
                testID={`option-${optionIndex}`}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.option,
                  { backgroundColor, borderColor, opacity: pressed ? 0.86 : 1 },
                ]}
              >
                <View style={[styles.letter, { backgroundColor: letterBg }]}>
                  <T bold color={letterColor}>
                    {LETTERS[optionIndex]}
                  </T>
                </View>
                <T style={styles.optionText}>{option}</T>
                {isCorrect ? <T color={theme.correct}>正确</T> : null}
                {isWrongPick ? <T color={theme.wrong}>你的选择</T> : null}
              </Pressable>
            );
          })}
        </View>
        {answered ? (
          <View style={styles.explain} testID="explanation">
            <T bold>解析</T>
            <T style={styles.explainBody}>{question.explanation}</T>
          </View>
        ) : null}
      </ScrollView>
      {answered ? (
        <View style={styles.footer}>
          <Pressable onPress={onNext} style={styles.next} testID="next-button" accessibilityRole="button">
            <T bold color={theme.white}>
              {nextLabel}
            </T>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function RichPrompt({ text }: { text: string }) {
  const parts = text.split('____');
  if (parts.length === 1) {
    return <T style={styles.prompt}>{text}</T>;
  }
  return (
    <T style={styles.prompt}>
      {parts[0]}
      <T bold color={theme.primary}>
        {' ____ '}
      </T>
      {parts.slice(1).join('____')}
    </T>
  );
}

const styles = {
  topBar: {
    minHeight: 48,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 8,
  },
  side: {
    width: 84,
    minHeight: 40,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sideRight: {
    justifyContent: 'flex-end' as const,
  },
  kicker: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.line,
  },
  progressFill: {
    height: 4,
    backgroundColor: theme.primary,
  },
  scroll: {
    padding: 20,
    paddingBottom: 28,
    gap: 12,
  },
  count: {
    fontSize: 13,
  },
  headline: {
    fontSize: 34,
    lineHeight: 42,
  },
  smallHeadline: {
    fontSize: 22,
    lineHeight: 30,
  },
  pill: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#E7F3EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  prompt: {
    fontSize: 17,
    lineHeight: 26,
  },
  helper: {
    fontSize: 14,
    marginTop: -4,
  },
  banner: {
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  bannerAnswer: {
    lineHeight: 22,
  },
  options: {
    gap: 10,
  },
  option: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    ...shadow,
    shadowOpacity: 0.04,
  },
  letter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  explain: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.line,
  },
  explainBody: {
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  next: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
