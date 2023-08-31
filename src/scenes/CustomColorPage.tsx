import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState } from 'react'

import { useBalancesAndExchange } from '../hooks/useBalancesAndExchange'
import { Account } from '../store/account/Account'

import AccountCard from '~src/components/AccountCard'
import SwiperPanel, { LabelButton, useSwiperController } from '~src/components/SwiperPanel'
import ColorPicker from '~src/components/misc/ColorPicker'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
export interface CustomColorPageParam {
  onColorPicked: (hex: string) => void
  account: Account
}

interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<ModalStackParamList, 'CustomColor'>
}

const CustomColorPage = (props: Props) => {
  const { account } = props.route.params
  const controller = useSwiperController(true)

  const balanceExchange = useBalancesAndExchange(account)

  const [color, setColor] = useState<string>(props.route.params.account.backgroundColor)

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
      leftButton={<LabelButton label={i18n.t('customColorPage.navigation.cancel')} onPress={controller.close} />}
      rightButton={<LabelButton label={i18n.t('customColorPage.navigation.done')} onPress={pickAndClose} />}
      onClose={props.navigation.goBack}
    >
      <AccountCard balanceExchange={balanceExchange} hideBalance={false} account={props.route.params.account} />
      <TextView mt="12px" mb="6px" color="text.0" width="100%" textAlign="center" fontSize="lg">
        {i18n.t('customColorPage.subtitle')}
      </TextView>

      <LinearLayout weight={1} alignItems="center">
        <ColorPicker color={color} onChange={colorPickerChangeEvent} />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default CustomColorPage
