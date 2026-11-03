import { createContext, useContext } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

import type { ColorMode } from '@/types';

export type Palette = {
  bg: string;
  card: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  primary: string;
  primaryDark: string;
  header: string;
  accent: string;
  correct: string;
  correctBg: string;
  wrong: string;
  wrongBg: string;
  white: string;
  chip: string;
  font: string;
  fontBold: string;
};

const shared = {
  font: 'NotoSansSC_400Regular',
  fontBold: 'NotoSansSC_700Bold',
  white: '#FFFFFF',
  correct: '#3DDC97',
  wrong: '#F07167',
};

export const darkTheme: Palette = {
  ...shared,
  bg: '#121417',
  card: '#1C2128',
  ink: '#F4F7FB',
  muted: '#A7B0BB',
  faint: '#7E8792',
  line: '#2C343E',
  primary: '#3DDC97',
  primaryDark: '#8FF0C2',
  header: '#0E1114',
  accent: '#F0A05A',
  correctBg: '#143528',
  wrongBg: '#3A201E',
  chip: '#2A313A',
};

export const lightTheme: Palette = {
  ...shared,
  bg: '#F4EFE6',
  card: '#FFFCF7',
  ink: '#1C1915',
  muted: '#6F675E',
  faint: '#A3988C',
  line: '#E6DDD0',
  primary: '#0E7A5F',
  primaryDark: '#0B5C48',
  header: '#0C5B47',
  accent: '#E07A2F',
  correct: '#0E7A5F',
  wrong: '#C44536',
  correctBg: '#E4F5EC',
  wrongBg: '#FDEEEC',
  chip: '#F3EBDD',
};

export const theme = darkTheme;

type ThemeValue = {
  palette: Palette;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeValue>({
  palette: darkTheme,
  mode: 'dark',
  setMode: () => undefined,
  toggle: () => undefined,
});

export function useTheme(): Palette {
  return useContext(ThemeContext).palette;
}

export function useThemeMode(): ThemeValue {
  return useContext(ThemeContext);
}

export const shadow: ViewStyle = {
  shadowColor: '#1C1915',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};

export const titleStyle: TextStyle = {
  fontFamily: theme.fontBold,
  color: theme.ink,
};
