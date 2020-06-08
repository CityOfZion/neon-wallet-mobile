import {Request, HttpExclude, HttpExpose} from '@simpli/serialized-request'

@HttpExclude()
export class NeoNode {
  @HttpExpose()
  url: string | null = null

  @HttpExpose()
  height: number | null = null

  static async getAllNodes() {
    return Request.get(`/get_all_nodes`)
      .name('getAllNodes')
      .asArrayOf(NeoNode)
      .getData()
  }
}
