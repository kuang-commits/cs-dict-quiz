import { Stack } from 'expo-router';

import { theme } from '@/theme';

export default function PracticeLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }} />;
}
