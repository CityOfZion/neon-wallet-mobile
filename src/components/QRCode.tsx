import React from 'react'
// @ts-ignore
import {QRCode} from 'react-native-custom-qr-codes-expo'

import {applicationConfig} from '../config/ApplicationConfig'

import {LinearLayout} from '~src/styles/styled-components'

export interface QRCodeProps {
  content: string
  qrCodeWidth?: number
}

const NeonQRCode = (props: QRCodeProps) => {
  const width = props.qrCodeWidth
    ? props.qrCodeWidth
    : applicationConfig.windowWidth - 76
  return (
    <LinearLayout orientation="verti" height={width}>
      <LinearLayout bg="transparent" orientation="verti" alignItems="center">
        <LinearLayout bg="white">
          <QRCode
            content={props.content}
            logoSize={74}
            ecl="M"
            padding={2}
            size={width}
          />
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

export default NeonQRCode
