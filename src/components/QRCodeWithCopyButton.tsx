import {useNavigation} from '@react-navigation/native'
import React, {Fragment} from 'react'

import {Facade} from '~src/app/Facade'
import NeonQRCode from '~src/components/QRCode'
import ThemedButton from '~src/components/themed/ThemedButton'
import {LinearLayout} from '~src/styles/styled-components'

interface QRCodeWithCopyButtonProps {
  qrCodeValue: string
}

export const QRCodeWithCopyButton = (props: QRCodeWithCopyButtonProps) => {
  const navigation = useNavigation()
  return (
    <Fragment>
      <NeonQRCode content={props.qrCodeValue} qrCodeWidth={300} />
      <LinearLayout width={'100%'} height={54} my={'12%'}>
        <ThemedButton
          label={Facade.t('app.copyToClipboard')}
          srcIcon={require('~/src/assets/images/icon-copy-green.png')}
          iconSize={[19, 23]}
          onPress={() => {
            navigation.navigate(Facade.route.CopyContextModal.name, {
              qrCode: 'TODO', // TODO: NW-307
              address: props.qrCodeValue,
            })
          }}
        />
      </LinearLayout>
    </Fragment>
  )
}
