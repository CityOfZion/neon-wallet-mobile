import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import InputLabel from '~src/components/InputLabel'
import { QRCodeWithCopyButton } from '~src/components/QRCodeWithCopyButton'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { Account } from '~src/models/redux/Account'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

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
      rightButton={<CloseButton mr="25px" />}
      fullSize
      controller={controller}
      onClose={props.navigation.goBack}
      title={props.route.params.account.name ?? ''}
      onRightPress={controller.close}
      solidColorBG
    >
      <LinearLayout justifyContent="space-between" height="100%">
        <LinearLayout>
          <InputLabel capitalize title={i18n.t('modals.accountQRCode.address')} />
          <TextView color="primary" fontFamily="medium" fontSize="17px" mb="12%">
            {props.route.params.account.address}
          </TextView>
        </LinearLayout>
        <QRCodeWithCopyButton qrCodeValue={props.route.params.account.address ?? ''} />
      </LinearLayout>
    </SwiperPanel>
  )
}
