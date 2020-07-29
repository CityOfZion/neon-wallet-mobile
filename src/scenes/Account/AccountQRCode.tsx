import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'

import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import {QRCodeWithCopyButton} from '~src/components/QRCodeWithCopyButton'
import SwiperPanel from '~src/components/SwiperPanel'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Account} from '~src/models/redux/Account'
import {TextView} from '~src/styles/styled-components'

export interface AccountQRCodeParams {
  address: string
}

interface AccountQRCodeProps {
  address: string
  navigation: StackNavigationProp<any>
}

export const AccountQRCode = (props: AccountQRCodeProps) => {
  return (
    <SwiperPanel
      onRightPress={() => {
        props.navigation.goBack()
      }}
    >
      <InputLabel title={Facade.t('screens.accountQRCode.address')} />
      <TextView color={'primary'} fontFamily={'medium'} fontSize={'18px'}>
        {props.address}
      </TextView>
      <QRCodeWithCopyButton qrCodeValue={props.address} />
    </SwiperPanel>
  )
}
