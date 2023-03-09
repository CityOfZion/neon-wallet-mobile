import { BlockchainServiceKey, TNetworkType } from '../blockchain'

export class DoraHelper {
  static buildTransactionUrl(network: TNetworkType, blockchain: BlockchainServiceKey, hash: string) {
    if (network !== 'mainnet' && network !== 'testnet') throw new Error('Dora does not supports custom networks')

    const blockchains: Partial<Record<BlockchainServiceKey, string>> = {
      neo3: 'neo3',
      neoLegacy: 'neo2',
    }

    return `https://dora.coz.io/transaction/${blockchains[blockchain]}/${network}/${hash}`
  }
}
