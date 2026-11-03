import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useProgress } from '@/state/progress';
import { theme } from '@/theme';

function tabColor(color: unknown): string {
  return typeof color === 'string' ? color : theme.faint;
}

export default function TabLayout() {
  const { wrongCount } = useProgress();
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
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: '词典',
          tabBarButtonTestID: 'tab-dictionary',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: '练习',
          tabBarButtonTestID: 'tab-practice',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'checkbox' : 'checkbox-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="wrongs"
        options={{
          title: '错题',
          tabBarButtonTestID: 'tab-wrongs',
          tabBarBadge: wrongCount > 0 ? wrongCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.wrong, fontSize: 11 },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'refresh-circle' : 'refresh-circle-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '收藏',
          tabBarButtonTestID: 'tab-favorites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'star' : 'star-outline'} color={tabColor(color)} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
