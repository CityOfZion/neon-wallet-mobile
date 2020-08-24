import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ColorPicker from '~src/components/misc/ColorPicker'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface CustomColorPageParam {
  onColorPicked: (hex: string) => void
}

interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'CustomColor'>
}

const CustomColorPage = (props: Props) => {
  const controller = useSwiperController(true)
  const defaultCardColor = '#00aaff'

  const [color, setColor] = useState<string>(defaultCardColor)

  // TODO: change mock values
  const account = new Account()
  account.srcIcon = require('~src/assets/images/card-neo.png')
  account.name = 'Demo Card'
  account.address = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
  account.backgroundColor = color

  const colorPickerChangeEvent = (hex: string) => {
    setColor(hex)
  }

  const pickAndClose = () => {
    props.route.params.onColorPicked(color)
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      title={Facade.t('customColorPage.title')}
      image={require('~src/assets/images/icon-palette-white.png')}
      leftButton={Facade.t('customColorPage.navigation.cancel')}
      rightButton={Facade.t('customColorPage.navigation.done')}
      onLeftPress={controller.close}
      onRightPress={pickAndClose}
      padding={16}
      paddingTop={20}
      onClose={() => props.navigation.goBack()}
    >
      <LinearLayout height="100%">
        <LinearLayout mb={5} maxHeight="35%" alignSelf="center">
          <AccountCard orientBy="height" account={account} hideQRCode={true} />
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
          {Facade.t('customColorPage.subtitle')}
        </TextView>

        <LinearLayout width="100%" weight={1} alignItems="center">
          <ColorPicker color={color} onChange={colorPickerChangeEvent} />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default CustomColorPage
