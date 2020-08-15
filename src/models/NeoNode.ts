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

  static async getHighestNodeUrl() {
    const pool = await this.getAllNodes()
    return this.getHighestNodeUrlFromPool(pool)
  }

  static getHighestNodeUrlFromPool(pool: NeoNode[]) {
    const height = this.getHighestNodeHeightFromPool(pool)
    return pool.find((it) => it.height === height)?.url ?? null
  }

  static getHighestNodeHeightFromPool(pool: NeoNode[]) {
    return pool.reduce(
      (max, node) => Math.max(max, node.height ?? 0),
      pool[0]?.height ?? 0
    )
  }
}
