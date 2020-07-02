import {LinearGradient} from 'expo-linear-gradient'
import {PixelRatio, Platform} from 'react-native'
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

const TextView = styled.Text<
  ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    TypographyProps &
    PositionProps &
    TextStyleProps
>`
  font-family: 'regular';
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${flexbox}
  ${position}
  ${weight}
`

const ImageView = styled.Image<
  SpaceProps & LayoutProps & FlexboxProps & PositionProps & WeightProps
>`
  ${space}
  ${layout}
  ${flexbox}
  ${position}
  ${weight}
`

const LinearLayout = styled.View<
  BorderProps &
    ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps
>`
  ${border}  
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
`

const RelativeLayout = styled.View<
  BorderProps &
    ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps
>`
  position: relative;
  > * {
    position: absolute;
  }
  ${border}  
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
`

const ButtonView = styled.TouchableOpacity<
  ColorProps &
    FlexboxProps &
    SpaceProps &
    BorderProps &
    LayoutProps &
    OrientationProps &
    PositionProps &
    WeightProps
>`
  ${layout}
  ${color}
  ${flexbox}
  ${space}
  ${border}
  ${orientation}
  ${position}
  ${weight}
`

const LinearGradientLayout = styled(LinearGradient)<
  ColorProps & SpaceProps & LayoutProps & FlexboxProps
>`
  ${layout}
  ${color}
  ${space}
  ${flexbox || 'flex: 1;'}
`

const StyledScrollView = styled.ScrollView<
  FlexboxProps & OrientationProps & LayoutProps & SpaceProps
>`
  ${orientation}
  ${flexbox}
  ${layout}
  ${space}
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

export function normalize(value: string | number) {
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
    return value
  }

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export {
  css,
  ThemeProvider,
  LinearLayout,
  RelativeLayout,
  TextView,
  ImageView,
  ButtonView,
  StyleConstants,
  LinearGradientLayout,
  StyledScrollView,
}
export default styled
