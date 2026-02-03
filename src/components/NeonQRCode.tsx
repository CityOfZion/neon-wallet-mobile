import React, { useState } from 'react'

import { type LayoutChangeEvent, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

type TProps = {
  value: string
}

const NeonQRCode = ({ value }: TProps) => {
  const [width, setWidth] = useState(0)

  const handleLayout = (event: LayoutChangeEvent) => {
    const layoutWidth = event.nativeEvent.layout.width

    setWidth(layoutWidth)
  }

  return (
    <View className="w-full overflow-hidden rounded-md" onLayout={handleLayout}>
      <QRCode value={value} ecl="M" size={width} quietZone={36} />
    </View>
  )
}

export default NeonQRCode
