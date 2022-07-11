import { TextInputProps } from 'react-native'
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

export interface ColorTheme {
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

export interface OrientationProps {
  orientation?: 'horiz' | 'verti'
}

export interface WeightProps {
  weight?: number
}

export type TextViewProps = ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  TypographyProps &
  PositionProps &
  TextStyleProps &
  BorderProps

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

export type ImageViewProps = SpaceProps & LayoutProps & FlexboxProps & PositionProps & WeightProps

export type LinearLayoutProps = BorderProps &
  ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  PositionProps

export type RelativeLayoutProps = BorderProps &
  ColorProps &
  OrientationProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  WeightProps &
  PositionProps

export type ButtonViewProps = ColorProps &
  FlexboxProps &
  SpaceProps &
  BorderProps &
  LayoutProps &
  OrientationProps &
  PositionProps &
  WeightProps

export type ButtonWithoutFeedbackViewProps = ColorProps &
  FlexboxProps &
  SpaceProps &
  BorderProps &
  LayoutProps &
  OrientationProps &
  PositionProps &
  WeightProps

export type LinearGradientLayoutProps = ColorProps & SpaceProps & LayoutProps & FlexboxProps

export type StyledScrollViewProps = FlexboxProps & OrientationProps & LayoutProps & SpaceProps
