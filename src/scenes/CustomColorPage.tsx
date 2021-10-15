import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {Dimensions} from 'react-native'

import AccountCard from '~src/components/AccountCard'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ColorPicker from '~src/components/misc/ColorPicker'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'
export interface CustomColorPageParam {
  onColorPicked: (hex: string) => void
  account: Account
}

interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'CustomColor'>
}

const CustomColorPage = (props: Props) => {
  const controller = useSwiperController(true)

  const [color, setColor] = useState<string>(
    props.route.params.account.backgroundColor
  )

  const colorPickerChangeEvent = (hex: string) => {
    props.route.params.account.backgroundColor = hex
    setColor(hex)
    props.route.params.account.backgroundColor = hex
  }

  const pickAndClose = () => {
    props.route.params.onColorPicked(color)
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('customColorPage.title')}
      leftButton={i18n.t('customColorPage.navigation.cancel')}
      rightButton={i18n.t('customColorPage.navigation.done')}
      onLeftPress={controller.close}
      onRightPress={pickAndClose}
      padding={16}
      paddingTop={20}
      onClose={() => props.navigation.goBack()}
      solidColorBG={true}
      smallerSize={true}
    >
      <LinearLayout height="100%">
        <LinearLayout
          mb={5}
          maxHeight={`${Dimensions.get('window').width * 0.6}px`}
          alignSelf="center"
        >
          <AccountCard
            orientBy="height"
            account={props.route.params.account}
            isCustomAccount={true}
          />
        </LinearLayout>

        <TextView
          mb={3}
          color="text.0"
          textAlign={'center'}
          fontSize={'lg'}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {i18n.t('customColorPage.subtitle')}
        </TextView>

        <LinearLayout width="100%" weight={1} alignItems="center">
          <ColorPicker color={color} onChange={colorPickerChangeEvent} />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default CustomColorPage
