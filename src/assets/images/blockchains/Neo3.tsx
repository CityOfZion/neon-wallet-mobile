import React from 'react'

import { Path, Svg, type SvgProps } from 'react-native-svg'

export const Neo3 = ({ fill, ...props }: SvgProps) => {
  return (
    <Svg width="29" height="34" viewBox="0 0 29 34" {...props}>
      <Path d="M0 5.60977V27.0155L13.9734 32V10.4206L29.0909 4.88033L15.3708 0L0 5.60977Z" fill={fill || 'white'} />
      <Path d="M15.1172 11.0373V22.7432L29.0906 27.7277V5.89648L15.1172 11.0373Z" fill={fill || 'white'} />
      <Path d="M0 5.60977V27.0155L13.9734 32V10.4206L29.0909 4.88033L15.3708 0L0 5.60977Z" fill={fill || '#58BE8C'} />
      <Path d="M15.1172 11.0373V22.7432L29.0906 27.7277V5.89648L15.1172 11.0373Z" fill={fill || '#00B596'} />
    </Svg>
  )
}
