import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';

type Props = TextProps & {
  bold?: boolean;
  color?: string;
};

export function T({ bold, color, style, ...rest }: Props) {
  const theme = useTheme();
  const base: TextStyle = {
    fontFamily: bold ? theme.fontBold : theme.font,
    color: color ?? theme.ink,
  };
  return <RNText {...rest} style={[base, style]} />;
}
