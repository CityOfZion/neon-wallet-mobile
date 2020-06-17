import {TokenValue} from '~src/models/TokenValue'

export class TokenBalance {
  assets: TokenValue[]

  constructor(assets: TokenValue[]) {
    this.assets = assets
  }
}
