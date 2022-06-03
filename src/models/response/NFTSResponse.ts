import {
  HttpExclude,
  ResponseExpose,
  ResponseSerialize,
} from '@simpli/serialized-request'

import {NFTResponse} from './NFTResponse'

@HttpExclude()
export class NFTSResponse {
  @ResponseExpose()
  totalPages!: number

  @ResponseExpose()
  @ResponseSerialize(NFTResponse)
  items: NFTResponse[] = []

  constructor(data: Omit<NFTSResponse, 'items'>) {
    Object.assign(this, data)
  }
}
