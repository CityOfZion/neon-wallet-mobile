import {LinearGradient} from 'expo-linear-gradient'
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

import {
  orientation,
  OrientationProps,
  weight,
  WeightProps,
} from '~src/styles/styled-system.config'

const StyleConstants = {
  fontSizes: {
    min: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
    '5xl': 64,
  },
  space: [0, 2, 4, 8, 12, 16, 32, 64, 128, 256, 512],
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
  ColorProps &
    LayoutProps &
    OrientationProps &
    PositionProps &
    SpaceProps &
    WeightProps
>`
  position: relative;
  > * {
    position: absolute;
  }
  ${color}
  ${layout}
  ${orientation}
  ${position}
  ${space}
  ${weight}
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

const StyledScrollView = styled.ScrollView<LayoutProps & SpaceProps>`
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
    background: string[]
    text: string[]
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
