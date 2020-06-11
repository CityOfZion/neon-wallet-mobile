import * as styledComponents from 'styled-components/native'

import DefaultTheme from '~src/styles/styled'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps, position, PositionProps,
  space,
  SpaceProps,
  typography, TypographyProps
} from 'styled-system'
import {orientation, OrientationProps, weight, WeightProps} from './styled-system.config'

const {
  default: styled,
  css,
  ThemeProvider
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<DefaultTheme>

const TextView = styled.Text<
  ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  TypographyProps
>`
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
`

const ImageView = styled.Image<SpaceProps & LayoutProps & FlexboxProps & WeightProps>`
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
`

const LinearLayout = styled.View<ColorProps & OrientationProps & SpaceProps & LayoutProps & FlexboxProps & WeightProps & PositionProps>`
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
`

const ButtonView = styled.TouchableHighlight<ColorProps & SpaceProps & BorderProps & LayoutProps>`
  ${layout}
  ${color}
  ${space}
  ${border}
`

export {css, ThemeProvider, LinearLayout, TextView, ImageView, ButtonView}
export default styled
