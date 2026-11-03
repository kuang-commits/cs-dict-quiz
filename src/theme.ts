import type { TextStyle, ViewStyle } from 'react-native';

export const theme = {
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
  correctBg: '#E4F5EC',
  wrong: '#C44536',
  wrongBg: '#FDEEEC',
  white: '#FFFFFF',
  chip: '#F3EBDD',
  font: 'NotoSansSC_400Regular',
  fontBold: 'NotoSansSC_700Bold',
};

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
