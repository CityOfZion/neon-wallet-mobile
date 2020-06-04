import {Request, HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class BlockIndex {
  @HttpExpose()
  height: number | null = null

  async getHeight() {
    return Request.get(`/get_height`).name('getHeight').as(this).getData()
  }
}
