import React from 'react'

import { Path, Svg, type SvgProps } from 'react-native-svg'

export const Base = ({ fill, ...props }: SvgProps) => {
  return (
    <Svg width="34" height="34" viewBox="0 0 34 34" {...props}>
      <Path
        d="M34 16.9947C34 26.3807 26.3755 33.9895 16.9703 33.9895C8.04723 33.9895 0.727008 27.1407 0 18.4233H22.5093V15.5662H0C0.727008 6.84876 8.04723 0 16.9703 0C26.3755 0 34 7.6088 34 16.9947Z"
        fill={fill || '#0052FF'}
      />
    </Svg>
  )
}
