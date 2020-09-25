import {useNavigation} from '@react-navigation/native'
import {LinearGradient as ExpoLinearGradient} from 'expo-linear-gradient'
import React, {Fragment, useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {layout, LayoutProps} from 'styled-system'

import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/redux/Account'
import {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onSelect?: (hex: string) => void
  account: Account
}

export default function ColorSelector(props: Props) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const navigation = useNavigation()
  const [color, setColor] = useState<string>()
  const colorsList = Facade.lodash.clone(
    Object.values(theme.colors.card) as string[]
  )

  // If color selected from color picker, adds to the list
  color && colorsList.push(color)

  // Each button
  const buttonList = colorsList.map((color, key) => (
    <TouchableWithoutFeedback
      key={key}
      onPress={() => {
        props.onSelect && props.onSelect(color)
      }}
    >
      <RelativeLayout
        width={71}
        height={71}
        alignItems="center"
        justifyContent="center"
      >
        <LinearLayout
          width="100%"
          height="100%"
          borderRadius={9}
          overflow="hidden"
          position="absolute"
        >
          <LinearGradient
            width="100%"
            height="100%"
            colors={[Facade.filter.toDarkerShade(color), color]}
          />
        </LinearLayout>
        <LinearLayout
          width="97%"
          height="97%"
          borderRadius={9}
          overflow="hidden"
        >
          <LinearGradient
            width="100%"
            height="100%"
            colors={[color, Facade.filter.toDarkerShade(color)]}
          />
        </LinearLayout>
      </RelativeLayout>
    </TouchableWithoutFeedback>
  ))

  // Custom Color button
  const customColorButton = (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(Facade.route.Modal.name, {
          screen: Facade.route.CustomColor.name,
          params: {
            onColorPicked: (hex: string) => {
              setColor(hex)
              props.onSelect && props.onSelect(hex)
            },
            account: props.account,
          },
        })
      }}
    >
      <RelativeLayout width={71} height={71}>
        <ImageView
          width={71}
          height={71}
          source={require('~src/assets/images/button-custom-color.png')}
          resizeMode="contain"
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
