import {HttpExclude, ResponseExpose} from '@simpli/serialized-request'

@HttpExclude()
export class NFTResponse {
  @ResponseExpose()
  id!: string

  @ResponseExpose()
  contractHash!: string

  @ResponseExpose()
  collectionName?: string

  @ResponseExpose()
  collectionImage?: string

  @ResponseExpose()
  symbol!: string

  @ResponseExpose()
  image?: string

  @ResponseExpose()
  name?: string

  constructor(data: NFTResponse) {
    Object.assign(this, data)
  }
}
