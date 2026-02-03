import type { SvgProps } from 'react-native-svg'
import { Line, Svg } from 'react-native-svg'

type TProps = SvgProps & { height?: number }

export const TwDashedLine = ({ height = 4, ...props }: TProps) => {
  const y = height / 2

  return (
    <Svg height={height} {...props}>
      <Line x1="0" y1={y} x2="100%" y2={y} stroke="currentColor" strokeWidth={4} strokeDasharray="10,5" />
    </Svg>
  )
}
