import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/Text';
import { useTheme } from '@/theme';

const RULES = [
  '英文选义答对 +10 XP，中文选词 +15 XP，例句填空 +20 XP。题越难，经验越多。',
  '同一节里连续答对会加连对加成：从第 2 次起每次多 2 XP，最多多 10 XP。',
  '一节里答过的题全部正确，额外 +30 XP。',
  '编程题第一次提交通过 +40 XP。已经通过的题再交，不再加这 40 XP。',
  '模拟考试答对只加对应题型的基础经验，不扣爱心，也不算连对加成。',
  '爱心每天 5 颗。章节练习答错扣 1 颗。错题本里答对，找回 1 颗，最多回到 5 颗。模拟考试不使用爱心。',
  '星星按本节已答题的正确率：60% 一星，80% 两星，100% 三星。',
  '等级每 100 XP 升 1 级。每日目标可选 10、20、30、50 XP。',
  '连续学习按本地日期计算，当天答过题就算一天。',
  '成就：完成第一节、连续 7 天、掌握 100 个术语、通过 10 道编程题。得到之后会留着。',
  '本周排行只在这台手机上，对手是示例，不是真人。',
  '模拟考试满分 100，90 分及格，没做的题算错，但不扣爱心。',
];

export default function RulesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }} testID="rules-page">
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={theme.ink} />
        </Pressable>
        <T bold style={{ fontSize: 18 }}>评分规则</T>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {RULES.map((rule) => (
          <T key={rule} style={{ lineHeight: 22 }}>{rule}</T>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  top: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, paddingHorizontal: 12 },
};
