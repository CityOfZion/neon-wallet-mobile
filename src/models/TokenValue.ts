import {ImageLoadEventData} from 'react-native'

export const NEO_HASH =
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
export const GAS_HASH =
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

export class TokenValue {
  name: string
  symbol: string
  hash: string
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
    // TODO: Hash
    this.hash = NEO_HASH
    this.holding = holding
    this.value = value
    this.color = color
    this.srcIcon = srcIcon
  }
}
