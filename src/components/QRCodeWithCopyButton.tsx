import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {Fragment, useRef} from 'react'
import ViewShot from 'react-native-view-shot'

import {wrapper} from '../app/ApplicationWrapper'
import {ModalStackParamList} from '../navigation/ModalStackNavigation'

import NeonQRCode from '~src/components/QRCode'
import ThemedButton from '~src/components/themed/ThemedButton'
import {LinearLayout} from '~src/styles/styled-components'

interface QRCodeWithCopyButtonProps {
  qrCodeValue: string
}

export const QRCodeWithCopyButton = (props: QRCodeWithCopyButtonProps) => {
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const qrCodeView = useRef<ViewShot>(null)

  const captureAndNavigate = async () => {
    const uri = (await qrCodeView.current?.capture?.()) ?? ''

    navigation.navigate(wrapper.route.CopyContextModal.name, {
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
          label={i18n.t('app.copyToClipboard')}
          srcIcon={require('~/src/assets/images/icon-copy-green.png')}
          iconSize={[19, 23]}
          onPress={captureAndNavigate}
        />
      </LinearLayout>
    </Fragment>
  )
}
