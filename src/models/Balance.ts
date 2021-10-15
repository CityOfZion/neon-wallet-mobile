import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class Balance {
  @HttpExpose()
  amount: number | null = null

  @HttpExpose('asset_symbol')
  assetSymbol: string | null = null

  @HttpExpose('asset_hash')
  assetHash: string | null = null

  @HttpExpose()
  asset: string | null = null
}
