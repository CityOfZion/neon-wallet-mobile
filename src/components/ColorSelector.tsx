import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { layout, LayoutProps } from 'styled-system'

import {RootState} from '../store/RootStore'

import {wrapper} from '~src/app/ApplicationWrapper'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
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
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const [color, setColor] = useState<string>()
  const colorsList = _.clone(Object.values(theme.colors.card) as string[])

  // If color selected from color picker, adds to the list
  color && colorsList.push(color)

  // Each button
  const buttonList = colorsList.map((color, key) => (
    <TouchableWithoutFeedback
      key={key}
      onPress={() => {
        if (props.onSelect) props.onSelect(color)
      }}
    >
      <RelativeLayout width={63} height={63} alignItems="center" justifyContent="center" borderRadius={9}>
        <LinearLayout width="100%" height="100%" borderRadius={9} overflow="hidden" position="absolute">
          {color === props.account.backgroundColor ? (
            <>
              <LinearLayout width="100%" height="100%" backgroundColor="white" />
            </>
          ) : (
            <LinearGradient width="100%" height="100%" colors={[color, FilterHelper.toDarkerShade(color)]} />
          )}
        </LinearLayout>
        <LinearLayout width="97%" height="97%" borderRadius={9} overflow="hidden" justifyContent="center">
          <LinearGradient width="100%" height="100%" colors={[color, FilterHelper.toDarkerShade(color)]} />
          {color === props.account.backgroundColor && (
            <ImageView
              width="50%"
              height="50%"
              resizeMode="contain"
              position="absolute"
              source={require('src/assets/images/icon-check-white.png')}
              alignSelf="center"
            />
          )}
        </LinearLayout>
      </RelativeLayout>
    </TouchableWithoutFeedback>
  ))

  // Custom Color button
  const customColorButton = (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.CustomColor.name,
          params: {
            onColorPicked: (hex: string) => {
              setColor(hex)
              if (props.onSelect) props.onSelect(hex)
            },
            account: props.account,
          },
        })
      }}
    >
      <RelativeLayout width={63} height={63}>
        <ImageView
          width={63}
          height={63}
          source={require('~src/assets/images/button-custom-color.png')}
          resizeMode="contain"
        />

        <TextView
          fontSize="10px"
          width="85%"
          ml="5px"
          mb="5px"
          position="absolute"
          bottom={0}
          color={theme.colors.text[7]}
          textAlign="center"
        >
          {i18n.t('components.colorSelector.customColor')}
        </TextView>
      </RelativeLayout>
    </TouchableWithoutFeedback>
  )
  buttonList.push(customColorButton)

  // Padding button (invisible area for padding scale)
  const paddingButton = <LinearLayout width={71} height={71} />

  // Buttons grouped by 4
  const buttonGroup = UtilsHelper.chunkPadded(buttonList, 4, paddingButton)
  return (
    <>
      {buttonGroup.map((button, key) => (
        <LinearLayout
          width="100%"
          orientation="horiz"
          justifyContent="space-between"
          key={key}
          mt={key === 0 ? 0 : 11 /* If first group of buttons, no top margin*/}
          mb={key === buttonGroup.length - 1 ? 0 : 11 /* If last group of buttons, no bottom margin*/}
        >
          {button}
        </LinearLayout>
      ))}
    </>
  )
}

const LinearGradient = styled(ExpoLinearGradient)<LayoutProps>`
  ${layout}
`
