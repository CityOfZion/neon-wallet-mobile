import React from 'react'

import { Defs, LinearGradient, Path, Stop, Svg, type SvgProps } from 'react-native-svg'

export const NeoLegacy = ({ fill, ...props }: SvgProps) => {
  return (
    <Svg width="28" height="32" viewBox="0 0 28 32" {...props}>
      <Defs>
        <LinearGradient
          id="paint0_linear_27_47"
          x1="1.06412"
          y1="27.3926"
          x2="20.7017"
          y2="10.6369"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#BEEA2E" />
          <Stop offset="1" stopColor="#52BA00" />
        </LinearGradient>
      </Defs>

      <Path
        d="M0.461548 6.08144L11.154 11.1493V32L0.461548 26.9322V6.08144ZM16.6446 0L0.974869 5.58304L11.5715 10.6829L27.1927 5.06784L16.6446 0ZM16.3557 9.54064V22.2987L27.4815 26.6426V5.53424L16.3557 9.54064Z"
        fill={fill || 'url(#paint0_linear_27_47)'}
      />
    </Svg>
  )
}
