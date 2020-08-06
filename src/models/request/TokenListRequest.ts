import {Request, HttpExclude, RequestExpose} from '@simpli/serialized-request'

import {Facade} from '~src/app/Facade'
import {TokenAsset} from '~src/models/TokenAsset'
import {TokenResponse} from '~src/types/token'

@HttpExclude()
export class TokenListRequest {
  constructor(date: Date) {
    this.date = date
  }

  @RequestExpose('date')
  date: Date

  async getTokens() {
    const {date} = this

    let response: TokenResponse

    try {
      response = await Request.get(
        `https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json?timestamp=${date.getTime()}`
      )
        .name('getTokens')
        .as<TokenResponse>()
        .getData()
    } catch {
      response = Facade.app.tokensMainNet
    }

    return this.tokenToAsset(response)
  }

  tokenToAsset(response: TokenResponse): TokenAsset[] {
    return Facade.lodash.map(
      response,
      (it) => new TokenAsset(it.companyName, it.symbol, it.networks[1].hash)
    )
  }
}
