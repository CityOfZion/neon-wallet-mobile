import React from 'react'
// @ts-ignore
import { QRCode } from 'react-native-custom-qr-codes-expo'

import { applicationConfig } from '~src/config/ApplicationConfig'
import { LinearLayout } from '~src/styles/styled-components'

export interface QRCodeProps {
  content: string
  size?: number
}

const NeonQRCode = ({ content, size = applicationConfig.windowWidth - 76 }: QRCodeProps) => {
  return (
    <LinearLayout bg="white">
      <QRCode content={content} logoSize={74} ecl="M" padding={2} size={size} />
    </LinearLayout>
  )
}

export default NeonQRCode
