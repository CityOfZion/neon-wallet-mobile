import React from 'react'

import { Path, Svg, type SvgProps } from 'react-native-svg'

export const Ethereum = ({ fill, ...props }: SvgProps) => {
  return (
    <Svg width="19" height="32" viewBox="0 0 19 32" {...props}>
      <Path
        d="M9.49711 0L9.28967 0.729017V21.8834L9.49711 22.0975L18.9943 16.2931L9.49711 0Z"
        fill={fill || '#343434'}
      />
      <Path d="M9.49718 0L0 16.2931L9.49718 22.0976V11.8299V0Z" fill={fill || '#8C8C8C'} />
      <Path
        d="M9.49714 23.9568L9.38025 24.1041V31.6398L9.49714 31.9928L19 18.1553L9.49714 23.9568Z"
        fill={fill || '#3C3C3B'}
      />
      <Path d="M9.49718 31.9927V23.9567L0 18.1552L9.49718 31.9927Z" fill={fill || '#8C8C8C'} />
      <Path d="M9.49707 22.0975L18.9941 16.2932L9.49707 11.8299V22.0975Z" fill={fill || '#141414'} />
      <Path d="M0.00012207 16.2932L9.49715 22.0975V11.8299L0.00012207 16.2932Z" fill={fill || '#393939'} />
    </Svg>
  )
}
