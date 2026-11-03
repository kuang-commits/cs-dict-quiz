import { Stack } from 'expo-router';

import { theme } from '@/theme';

export default function DictionaryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }} />
  );
}
