import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';
import { firstParam } from '@/utils';

export default function CreateSubjectScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const existingId = firstParam(useLocalSearchParams<{ subjectId?: string }>().subjectId);
  const { data, createSubject, addTerm } = useProgress();
  const [subjectId, setSubjectId] = useState(existingId);
  const [name, setName] = useState(data.customSubjects.find((subject) => subject.id === existingId)?.name ?? '');
  const [english, setEnglish] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [chinese, setChinese] = useState('');
  const [example, setExample] = useState('');
  const terms = data.customTerms.filter((term) => term.subjectId === subjectId);

  function ensureSubject() {
    if (subjectId) return subjectId;
    const created = createSubject(name);
    if (created) setSubjectId(created);
    return created;
  }

  function saveTerm() {
    const id = ensureSubject();
    if (!id) return;
    addTerm(id, { english, pronunciation, chinese, example });
    setEnglish('');
    setPronunciation('');
    setChinese('');
    setExample('');
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="create-subject-screen">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={26} color={theme.ink} />
        </Pressable>
        <T bold style={{ fontSize: 18 }}>
          自建科目
        </T>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
        <Field label="科目名称" value={name} onChangeText={setName} placeholder="例如 计算机网络实验" testID="subject-name" editable={!subjectId} />
        <T bold style={{ marginTop: 8 }}>
          添加术语
        </T>
        <T color={theme.muted}>保存后会自动生成英文选义、中文选词和例句填空。</T>
        <Field label="英文" value={english} onChangeText={setEnglish} placeholder="Packet" testID="term-english" />
        <Field label="谐音" value={pronunciation} onChangeText={setPronunciation} placeholder="帕克特" testID="term-pronunciation" />
        <Field label="中文意思" value={chinese} onChangeText={setChinese} placeholder="数据包" testID="term-chinese" />
        <Field label="例句" value={example} onChangeText={setExample} placeholder="一张图片会拆成很多 Packet。" testID="term-example" />
        <Pressable
          onPress={saveTerm}
          testID="save-term"
          accessibilityRole="button"
          style={[styles.save, { backgroundColor: theme.primary, opacity: name.trim() && english.trim() && chinese.trim() ? 1 : 0.45 }]}
        >
          <T bold color={theme.bg}>
            保存术语
          </T>
        </Pressable>
        {terms.map((term) => (
          <T key={term.id} color={theme.muted}>
            {term.english} · {term.chinese}
          </T>
        ))}
        {subjectId ? (
          <Pressable onPress={() => router.replace(`/subjects/${subjectId}`)} testID="open-created" accessibilityRole="button">
            <T bold color={theme.primary}>
              查看这个科目
            </T>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  testID,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  testID: string;
  editable?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <T color={theme.muted}>{label}</T>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.faint}
        testID={testID}
        style={{
          backgroundColor: theme.card,
          color: theme.ink,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.line,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontFamily: theme.font,
          fontSize: 16,
        }}
      />
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12 },
  save: { minHeight: 48, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
};
