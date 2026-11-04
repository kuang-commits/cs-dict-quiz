import { Stack } from 'expo-router';

import { theme } from '@/theme';

export default function WrongsLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }} />;
}
