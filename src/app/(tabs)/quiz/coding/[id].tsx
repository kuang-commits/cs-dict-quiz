import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { codingProblemById } from '@/data/coding-problems';
import { terms } from '@/data/terms';
import { judgeLabel } from '@/judge';
import { runTests, type TestReport } from '@/judge/grade';
import type { CodingLanguage } from '@/judge/types';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';
import { firstParam } from '@/utils';

export default function CodingProblemScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const id = firstParam(useLocalSearchParams<{ id: string }>().id);
  const problem = codingProblemById[id];
  const { recordCoding } = useProgress();
  const [language, setLanguage] = useState<CodingLanguage>('javascript');
  const [code, setCode] = useState<Record<CodingLanguage, string>>({
    javascript: problem?.starter.javascript ?? '',
    python: problem?.starter.python ?? '',
  });
  const [reports, setReports] = useState<TestReport[] | null>(null);
  const [mode, setMode] = useState<'sample' | 'submit' | null>(null);
  const [running, setRunning] = useState(false);

  if (!problem) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <T>没有这道编程题</T>
      </View>
    );
  }

  async function run(nextMode: 'sample' | 'submit') {
    if (!problem) return;
    setRunning(true);
    setMode(nextMode);
    const result = await runTests(problem, language, code[language], nextMode);
    setReports(result);
    setRunning(false);
    const judgeDown = result.length > 0 && result.every((item) => item.degraded);
    if (nextMode === 'submit' && !judgeDown) recordCoding(problem.id, result.every((item) => item.pass));
  }

  const allPass = reports !== null && reports.length > 0 && reports.every((item) => item.pass);
  const judgeDown = reports !== null && reports.length > 0 && reports.every((item) => item.degraded);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32 }}
      testID="coding-problem"
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <T color={theme.primary}>返回</T>
        </Pressable>
        <T bold style={{ fontSize: 26 }}>
          {problem.title}
        </T>
        <Statement text={problem.statement} />
        <T bold>样例</T>
        {problem.sampleTests.map((test, index) => (
          <View key={test.input} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12, gap: 4 }}>
            <T color={theme.muted}>样例 {index + 1}</T>
            <T>输入：{test.input || '（空）'}</T>
            <T>输出：{test.expected || '（空）'}</T>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Lang label="JavaScript" active={language === 'javascript'} onPress={() => setLanguage('javascript')} testID="language-javascript" />
          <Lang label="Python" active={language === 'python'} onPress={() => setLanguage('python')} testID="language-python" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <T color={theme.muted}>当前判题：{judgeLabel(language)}。函数名固定为 solve(data)。</T>
          {language === 'python' ? (
            <View testID="python-online-badge" style={{ backgroundColor: theme.chip, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
              <T bold style={{ fontSize: 12 }}>需联网</T>
            </View>
          ) : null}
        </View>
        <TextInput
          value={code[language]}
          onChangeText={(value) => setCode((current) => ({ ...current, [language]: value }))}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          testID="code-editor"
          style={{
            minHeight: 220,
            backgroundColor: theme.card,
            color: theme.ink,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.line,
            padding: 12,
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 20,
            textAlignVertical: 'top',
          }}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => run('sample')}
            disabled={running}
            testID="run-code"
            accessibilityRole="button"
            style={{ flex: 1, backgroundColor: theme.card, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.line }}
          >
            <T bold>{running && mode === 'sample' ? '运行中' : '运行'}</T>
          </Pressable>
          <Pressable
            onPress={() => run('submit')}
            disabled={running}
            testID="submit-code"
            accessibilityRole="button"
            style={{ flex: 1, backgroundColor: theme.primary, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center' }}
          >
            <T bold color={theme.bg}>
              {running && mode === 'submit' ? '提交中' : '提交'}
            </T>
          </Pressable>
        </View>
        {reports ? (
          <View testID="run-result" style={{ gap: 8 }}>
            {judgeDown ? (
              <View testID="judge-degrade" style={{ backgroundColor: theme.card, borderRadius: 14, padding: 14, gap: 6, borderWidth: 1, borderColor: theme.accent }}>
                <T bold>判题服务暂时不可用</T>
                <T>{reports[0]?.stderr}</T>
                <T color={theme.muted}>这次没有记入错题本。</T>
              </View>
            ) : (
            <T bold color={allPass ? theme.primary : theme.wrong}>
              {mode === 'submit' ? (allPass ? '提交通过' : '提交未通过，已放入错题本') : allPass ? '样例通过' : '样例未通过'}
            </T>
            )}
            {judgeDown ? null : reports.map((report, index) => (
              <View key={`${report.hidden}-${index}`} style={{ backgroundColor: report.pass ? theme.correctBg : theme.wrongBg, borderRadius: 12, padding: 12, gap: 4 }}>
                <T bold>{report.hidden ? `隐藏测试 ${index + 1}` : `样例 ${index + 1}`} · {report.pass ? '通过' : '未通过'} · {report.timeMs} ms</T>
                {report.hidden ? null : <T>输入：{report.input || '（空）'}</T>}
                <T>输出：{report.stdout || '（空）'}</T>
                {report.stderr ? <T color={theme.wrong}>错误：{report.stderr}</T> : null}
                {report.hidden || report.pass ? null : <T>期望：{report.expected || '（空）'}</T>}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function Statement({ text }: { text: string }) {
  const theme = useTheme();
  const parts = text.split(/\{([a-z0-9-]+)\}/g);
  return (
    <T style={{ fontSize: 16, lineHeight: 24 }}>
      {parts.map((part, index) => {
        if (index % 2 === 0) return part;
        const term = terms.find((item) => item.id === part);
        if (!term) return part;
        return (
          <T
            key={`${part}-${index}`}
            bold
            color={theme.primary}
            onPress={() => router.push(`/search/${part}`)}
            testID={`term-link-${part}`}
          >
            {term.english}
          </T>
        );
      })}
    </T>
  );
}

function Lang({ label, active, onPress, testID }: { label: string; active: boolean; onPress: () => void; testID: string }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? theme.primary : theme.chip }}
    >
      <T bold color={active ? theme.bg : theme.ink}>
        {label}
      </T>
    </Pressable>
  );
}
