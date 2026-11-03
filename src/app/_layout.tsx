import { NotoSansSC_400Regular, NotoSansSC_700Bold } from '@expo-google-fonts/noto-sans-sc';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProgressProvider } from '@/state/progress';
import { theme } from '@/theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSansSC_400Regular,
    NotoSansSC_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.title = '计算机词典刷题';
    document.body.style.backgroundColor = '#E7E0D4';
    document.body.style.margin = '0';
  }, []);

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <PhoneFrame>
          <RouteStatus />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.bg },
              animation: 'slide_from_right',
            }}
          />
        </PhoneFrame>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}

function RouteStatus() {
  const path = usePathname();
  const light = path === '/' || path.startsWith('/exam');
  return <StatusBar style={light ? 'light' : 'dark'} />;
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'web' || width < 520) return <>{children}</>;
  const frameHeight = Math.min(Math.max(height - 36, 640), 844);
  return (
    <View style={styles.stage}>
      <View style={[styles.device, { height: frameHeight }]}>{children}</View>
      <Text style={styles.caption}>计算机词典刷题</Text>
    </View>
  );
}

const styles = {
  stage: {
    flex: 1,
    backgroundColor: '#E7E0D4',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  device: {
    width: 390,
    borderRadius: 32,
    overflow: 'hidden' as const,
    borderWidth: 8,
    borderColor: '#1C1915',
    backgroundColor: theme.bg,
  },
  caption: {
    marginTop: 10,
    color: '#6F675E',
    fontSize: 13,
  },
};
