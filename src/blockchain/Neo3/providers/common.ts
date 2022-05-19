import {NFTSResponse} from '~/src/models/response/NFTSResponse'
import {BlockchainDataProvider} from '~src/blockchain'

export interface Neo3Provider extends BlockchainDataProvider {
  getNFTS(address: string, page: number): Promise<NFTSResponse>
}
