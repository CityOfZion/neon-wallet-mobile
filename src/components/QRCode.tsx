import React from 'react'
import {Dimensions} from 'react-native'
import {QRCode} from 'react-native-custom-qr-codes-expo'

import {LinearLayout} from '~src/styles/styled-components'

export interface QRCodeProps {
  content: string
  qrCodeWidth?: number
}

const NeonQRCode = (props: QRCodeProps) => {
  const width = props.qrCodeWidth ? props.qrCodeWidth : Dimensions.get('window').width - 76
  return (
    <LinearLayout orientation="verti" height={width}>
      <LinearLayout bg="transparent" orientation="verti" alignItems="center">
        <LinearLayout bg="white">
          <QRCode
            content={props.content}
            logoSize={74}
            logo={require('../assets/images/icon-neon-white.png')}
            ecl="H"
            padding={2}
            size={(width, width)}
          />
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

export default NeonQRCode
