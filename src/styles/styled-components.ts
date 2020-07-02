import {LinearGradient} from 'expo-linear-gradient'
import {PixelRatio, Platform, TextInputProps} from 'react-native'
import * as styledComponents from 'styled-components/native'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  textStyle,
  TextStyleProps,
  typography,
  TypographyProps,
} from 'styled-system'

import {SCREEN_WIDTH} from '~/constants'
import {
  orientation,
  OrientationProps,
  weight,
  WeightProps,
} from '~src/styles/styled-system.config'

const StyleConstants = {
  fontSizes: {
    min: normalize(10),
    xs: normalize(12),
    sm: normalize(14),
    md: normalize(16),
    lg: normalize(18),
    xl: normalize(20),
    '2xl': normalize(24),
    '3xl': normalize(32),
    '4xl': normalize(48),
    '5xl': normalize(64),
  },
  space: [0, 2, 4, 8, 12, 16, 32, 64, 128, 256, 512].map((it) => normalize(it)),
}

const {
  default: styled,
  css,
  ThemeProvider,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<
  DefaultTheme
>

export type TextViewProps = ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  TypographyProps &
  PositionProps &
  TextStyleProps

const TextView = styled.Text<TextViewProps>`
  font-family: 'regular';
  ${color} ${typography} ${space} ${layout} ${flexbox} ${position} ${weight} ${textStyle}
`

export type InputTextViewProps = TextInputProps &
  BorderProps &
  ColorProps &
  TypographyProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  PositionProps &
  TextStyleProps

const InputTextView = styled.TextInput<InputTextViewProps>`
  ${border} ${color} ${typography} ${orientation} ${space} ${layout} ${flexbox} ${weight} ${position} ${textStyle}
`

export type ImageViewProps = SpaceProps &
  LayoutProps &
  FlexboxProps &
  PositionProps &
  WeightProps

const ImageView = styled.Image<ImageViewProps>`
  ${space} ${layout} ${flexbox} ${position} ${weight}
`

export type LinearLayoutProps = BorderProps &
  ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  PositionProps

const LinearLayout = styled.View<LinearLayoutProps>`
  ${border} ${color} ${orientation} ${space} ${layout} ${flexbox} ${weight} ${position}
`

export type RelativeLayoutProps = BorderProps &
  ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  PositionProps

const RelativeLayout = styled.View<RelativeLayoutProps>`
  position: relative;
  > * {
    position: absolute;
  }
  ${border} ${color} ${orientation} ${space} ${layout} ${flexbox} ${weight} ${position}
`

export type ButtonViewProps = ColorProps &
  FlexboxProps &
  SpaceProps &
  BorderProps &
  LayoutProps &
  OrientationProps &
  PositionProps &
  WeightProps

const ButtonView = styled.TouchableOpacity<ButtonViewProps>`
  ${layout} ${color} ${flexbox} ${space} ${border} ${orientation} ${position} ${weight}
`

export type LinearGradientLayoutProps = ColorProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps

const LinearGradientLayout = styled(LinearGradient)<LinearGradientLayoutProps>`
  ${layout} ${color} ${space} ${flexbox || 'flex: 1;'}
`

export type StyledScrollViewProps = FlexboxProps &
  OrientationProps &
  LayoutProps &
  SpaceProps

const StyledScrollView = styled.ScrollView<StyledScrollViewProps>`
  ${orientation} ${flexbox} ${layout} ${space}
`

export interface DefaultTheme {
  title: string
  statusBarStyle: 'default' | 'light-content' | 'dark-content'

  colors: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    background: string[]
    text: string[]
    card: string[]
  }
}

export function normalize<T extends string | number>(
  value?: string | number
): T {
  let size

  if (typeof value === 'string') {
    const regex = /^(\d+)(?:px)?$/.exec(value)
    if (regex?.[1]) {
      size = Number(regex[1])
    }
  } else {
    size = Number(value)
  }

  const scale = SCREEN_WIDTH / 414
  const newSize = Number(size) * scale

  if (isNaN(newSize)) {
    return value as T
  }

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) as T
  } else {
    return (Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2) as T
  }
}

export {
  css,
  ThemeProvider,
  LinearLayout,
  RelativeLayout,
  TextView,
  InputTextView,
  ImageView,
  ButtonView,
  StyleConstants,
  LinearGradientLayout,
  StyledScrollView,
}
export default styled
