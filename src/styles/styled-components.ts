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
    TypographyProps
>`
  font-family: 'sofiapro-regular';
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
`

const ImageView = styled.Image<
  SpaceProps & LayoutProps & FlexboxProps & WeightProps
>`
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
`

const LinearLayout = styled.View<
  ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps
>`
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
`

const ButtonView = styled.TouchableHighlight<
  ColorProps & SpaceProps & BorderProps & LayoutProps
>`
  ${layout}
  ${color}
  ${space}
  ${border}
`

export interface DefaultTheme {
  title: string

  colors: {
    primary: string
    secondary: string
    tertiary: string

    background: string
    text: string[]
  }
}

export {
  css,
  ThemeProvider,
  LinearLayout,
  TextView,
  ImageView,
  ButtonView,
  StyleConstants,
}
export default styled
