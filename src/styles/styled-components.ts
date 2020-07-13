import {LinearGradient} from 'expo-linear-gradient'
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
} from 'styled-system'

import {Facade} from '~src/app/Facade'
import {orientation, weight} from '~src/styles/styled-system.config'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

const {
  default: styled,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<
  ApplicationTheme
>

export const TextView = styled.Text<TextViewProps>`
  font-family: 'regular';
  include-font-padding: false;
  ${Facade.utils.isAndroid ? 'margin-bottom: 5px' : ''}
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
`

export const LinearGradientLayout = styled(LinearGradient)<
  LinearGradientLayoutProps
>`
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
