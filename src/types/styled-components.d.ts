export declare global {
  import {TextInputProps} from 'react-native'
  import {
    BorderProps,
    ColorProps,
    FlexboxProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    TextStyleProps,
    TypographyProps,
  } from 'styled-system'

  interface ColorTheme {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    quinary: string
    background: ColorGroup
    text: ColorGroup
    card: ColorGroup
    danger: string
  }

  interface ColorGroup {
    [key: number]: string
  }

  interface OrientationProps {
    orientation?: 'horiz' | 'verti'
  }

  interface WeightProps {
    weight?: number
  }

  type TextViewProps = ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    TypographyProps &
    PositionProps &
    TextStyleProps &
    BorderProps

  type InputTextViewProps = TextInputProps &
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

  type ImageViewProps = SpaceProps &
    LayoutProps &
    FlexboxProps &
    PositionProps &
    WeightProps

  type LinearLayoutProps = BorderProps &
    ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps

  type RelativeLayoutProps = BorderProps &
    ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps

  type ButtonViewProps = ColorProps &
    FlexboxProps &
    SpaceProps &
    BorderProps &
    LayoutProps &
    OrientationProps &
    PositionProps &
    WeightProps

  type LinearGradientLayoutProps = ColorProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps

  type StyledScrollViewProps = FlexboxProps &
    OrientationProps &
    LayoutProps &
    SpaceProps
}
