import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useProgress } from '@/state/progress';
import { useTheme } from '@/theme';

function tabColor(color: unknown): string {
  return typeof color === 'string' ? color : '#7E8792';
}

export default function TabLayout() {
  const { wrongCount, dueCount } = useProgress();
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.faint,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.line,
          height: 62,
          paddingTop: 4,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontBold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="search"
        options={{
          title: '查词',
          tabBarButtonTestID: 'tab-search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: '刷题',
          tabBarButtonTestID: 'tab-quiz',
          tabBarBadge: wrongCount > 0 ? wrongCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.wrong, fontSize: 11 },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '复习',
          tabBarButtonTestID: 'tab-review',
          tabBarBadge: dueCount > 0 ? dueCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.accent, fontSize: 11 },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'albums' : 'albums-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarButtonTestID: 'tab-me',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
