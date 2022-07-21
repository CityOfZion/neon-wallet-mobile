import { LinearGradient } from 'expo-linear-gradient'
import * as styledComponents from 'styled-components/native'
import {
  border,
  color,
  flexbox,
  layout,
  position,
  space,
  textStyle,
  typography,
  borderRadius,
  shadow,
} from 'styled-system'

import {
  ButtonViewProps,
  ButtonWithoutFeedbackViewProps,
  ImageViewProps,
  InputTextViewProps,
  LinearGradientLayoutProps,
  LinearLayoutProps,
  RelativeLayoutProps,
  StyledScrollViewProps,
  TextViewProps,
} from '../types/styled-components'

import { orientation, weight } from '~src/styles/styled-system.config'

const styled = styledComponents.default

// TODO: iOS has a natural margin at the bottom of the text view, so we need to think of a solution to make both OS the same
export const TextView = styled.Text<TextViewProps>`
  font-family: 'regular';
  ${border}
  ${color}
  ${typography}
  ${space}
  ${layout}
  ${flexbox}
  ${position}
  ${weight}
  ${textStyle}
`

export const InputTextView = styled.TextInput<InputTextViewProps>`
  ${border}
  ${color}
  ${typography}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
  ${textStyle}
`

export const ImageView = styled.Image<ImageViewProps>`
  ${space}
  ${layout}
  ${flexbox}
  ${position}
  ${weight}
  ${color}
`

export const LinearLayout = styled.View<LinearLayoutProps>`
  ${border}
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
  ${shadow}
`

export const RelativeLayout = styled.View<RelativeLayoutProps>`
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

export const ButtonView = styled.TouchableOpacity<ButtonViewProps>`
  ${layout}
  ${color}
  ${flexbox}
  ${space}
  ${border}
  ${orientation}
  ${position}
  ${weight}
  ${borderRadius}
`

export const ButtonWithoutFeedbackView = styled.TouchableWithoutFeedback<ButtonWithoutFeedbackViewProps>`
  ${layout}
  ${color}
  ${flexbox}
  ${space}
  ${border}
  ${orientation}
  ${position}
  ${weight}
  ${borderRadius}
`

export const LinearGradientLayout = styled(LinearGradient)<LinearGradientLayoutProps>`
  ${border}
  ${orientation}
  ${layout}
  ${color}
  ${space}
  ${flexbox || 'flex: 1;'}
`

export const StyledScrollView = styled.ScrollView<StyledScrollViewProps>`
  ${orientation}
  ${flexbox}
  ${layout}
  ${space}
`

export default styled
