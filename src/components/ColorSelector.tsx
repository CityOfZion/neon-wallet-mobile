import {useNavigation} from '@react-navigation/native'
import {LinearGradient as ExpoLinearGradient} from 'expo-linear-gradient'
import React, {Fragment} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {layout, LayoutProps} from 'styled-system'

import {Facade} from '~src/app/Facade'
import {RootState} from '~src/store/reducers/root'
import {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onSelect?: (hex: string) => void
}

export default function ColorSelector(props: Props) {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const navigation = useNavigation()

  // Each button
  const buttonList = theme.colors.card.map((color, key) => (
    <TouchableWithoutFeedback
      key={key}
      onPress={() => {
        props.onSelect && props.onSelect(color)
      }}
    >
      <LinearLayout width={71} height={71} borderRadius={9} overflow="hidden">
        <LinearGradient
          width="100%"
          height="100%"
          colors={[color, Facade.filter.toDarkerShade(color)]}
        />
      </LinearLayout>
    </TouchableWithoutFeedback>
  ))

  // Custom Color button
  const customColorButton = (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(Facade.path.CustomColor.name)
      }}
    >
      <RelativeLayout width={71} height={71}>
        <ImageView
          m="auto"
          resizeMode="contain"
          source={require('~src/assets/images/button-custom-color.png')}
          position="absolute"
        />
        <TextView
          fontSize="12px"
          width="100%"
          mb="11px"
          position="absolute"
          bottom={0}
          color={theme.colors.text[7]}
          textAlign="center"
        >
          {Facade.t('components.colorSelector.customColor')}
        </TextView>
      </RelativeLayout>
    </TouchableWithoutFeedback>
  )
  buttonList.push(customColorButton)

  // Padding button (invisible area for padding scale)
  const paddingButton = <LinearLayout width={71} height={71} />

  // Buttons grouped by 4
  const buttonGroup = Facade.utils.chunkPadded(buttonList, 4, paddingButton)
  return (
    <Fragment>
      {buttonGroup.map((button, key) => (
        <LinearLayout
          width="100%"
          orientation="horiz"
          justifyContent="space-between"
          key={key}
          mt={key === 0 ? 0 : 16 /* If first group of buttons, no top margin*/}
          mb={
            key === buttonGroup.length - 1
              ? 0
              : 16 /* If last group of buttons, no bottom margin*/
          }
        >
          {button}
        </LinearLayout>
      ))}
    </Fragment>
  )
}

const LinearGradient = styled(ExpoLinearGradient)<LayoutProps>`
  ${layout}
`
