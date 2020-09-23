import {useNavigation} from '@react-navigation/native'
import React, {Fragment, useRef} from 'react'

import {Facade} from '~src/app/Facade'
import NeonQRCode from '~src/components/QRCode'
import ThemedButton from '~src/components/themed/ThemedButton'
import {LinearLayout} from '~src/styles/styled-components'
import ViewShot from 'react-native-view-shot'

interface QRCodeWithCopyButtonProps {
  qrCodeValue: string
}

export const QRCodeWithCopyButton = (props: QRCodeWithCopyButtonProps) => {
  const navigation = useNavigation()
  const qrCodeView = useRef<ViewShot>(null)

  const captureAndNavigate = async () => {
    const uri = await qrCodeView.current?.capture?.()

    navigation.navigate(Facade.route.CopyContextModal.name, {
      qrCode: uri,
      address: props.qrCodeValue,
    })
  }

  return (
    <Fragment>
      <ViewShot ref={qrCodeView}>
        <NeonQRCode content={props.qrCodeValue} qrCodeWidth={300} />
      </ViewShot>
      <LinearLayout width={'100%'} height={54} my={'12%'}>
        <ThemedButton
          label={Facade.t('app.copyToClipboard')}
          srcIcon={require('~/src/assets/images/icon-copy-green.png')}
          iconSize={[19, 23]}
          onPress={captureAndNavigate}
        />
      </LinearLayout>
    </Fragment>
  )
}
