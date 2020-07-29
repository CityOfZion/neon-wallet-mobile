import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'

import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import {QRCodeWithCopyButton} from '~src/components/QRCodeWithCopyButton'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TextView} from '~src/styles/styled-components'

export interface AccountQRCodeParams {
  account: Account
}

interface AccountQRCodeProps {
  route: RouteProp<ModalStackParamList, 'AccountQRCode'>
  navigation: StackNavigationProp<any>
}

export const AccountQRCode = (props: AccountQRCodeProps) => {
  const controller = useSwiperController(true)
  return (
    <SwiperPanel
      onRightPress={controller.close}
      rightButton={CloseButton()}
      fullSize={true}
      controller={controller}
      onClose={props.navigation.goBack}
      title={props.route.params.account.name ?? ''}
      image={props.route.params.account.srcIcon ?? require("~/src/assets/images/icon-neo-white.png")}
    >
      <InputLabel
        capitalize={true}
        title={Facade.t('modals.accountQRCode.address')}
      />
      <TextView
        color={'primary'}
        fontFamily={'medium'}
        fontSize={'17px'}
        mb={'12%'}
      >
        {props.route.params.account.address}
      </TextView>
      <QRCodeWithCopyButton
        qrCodeValue={props.route.params.account.address ?? ''}
      />
    </SwiperPanel>
  )
}
