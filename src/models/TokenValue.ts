import {ImageLoadEventData} from '~/node_modules/@types/react-native'

export class TokenValue {
  name: string
  symbol: string
  holding: number
  value: number
  color: string | null
  srcIcon: ImageLoadEventData | null

  constructor(
    name: string,
    symbol: string,
    holding: number,
    value: number,
    color: string | null = null,
    srcIcon: ImageLoadEventData | null = null
  ) {
    this.name = name
    this.symbol = symbol
    this.holding = holding
    this.value = value
    this.color = color
    this.srcIcon = srcIcon
  }
}
