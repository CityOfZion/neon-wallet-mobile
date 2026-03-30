import type { TBSAccount } from '@cityofzion/blockchain-service'
import { BSKeychainHelper, hasLedger } from '@cityofzion/blockchain-service'
import { BSBitcoinConstants } from '@cityofzion/bs-bitcoin'
import type { BSAggregator } from '@cityofzion/bs-multichain'

import { AppError } from './ErrorHelper'
import { I18nextHelper } from './I18nextHelper'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

type TGetServiceAccountParams = {
  account: TAccount
  key: string
}

const { t } = I18nextHelper.get()

export class BlockchainServiceHelper {
  static bsAggregator: BSAggregator<TBlockchainServiceKey>
  static blockchainNames: TBlockchainServiceKey[]

  static async #getHardwareWalletTransport(account: TBSAccount<TBlockchainServiceKey>) {
    try {
      const { HardwareWalletHelper } = await import('./HardwareWalletHelper')
      return HardwareWalletHelper.getTransport(account)
    } catch (error) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletIsNotConnectOrUnlocked'), error)
    }
  }

  static async setup() {
    if (this.bsAggregator) return

    const [{ BSAggregator }, { BSNeo3 }, { BSNeoLegacy }, { BSNeoX }, { BSBitcoin }, { BSSolana }, { BSEthereum }] =
      await Promise.all([
        import('@cityofzion/bs-multichain'),
        import('@cityofzion/bs-neo3'),
        import('@cityofzion/bs-neo-legacy'),
        import('@cityofzion/bs-neox'),
        import('@cityofzion/bs-bitcoin'),
        import('@cityofzion/bs-solana'),
        import('@cityofzion/bs-ethereum'),
      ])

    const services = await Promise.all([
      Promise.resolve(new BSNeo3('neo3', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoLegacy('neoLegacy', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoX('neox', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(
        new BSBitcoin(
          'bitcoin',
          __DEV__ ? BSBitcoinConstants.TESTNET_NETWORK : undefined,
          this.#getHardwareWalletTransport.bind(this)
        )
      ),
      Promise.resolve(new BSSolana('solana', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('ethereum', 'ethereum', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('polygon', 'polygon', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('base', 'base', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('arbitrum', 'arbitrum', undefined, this.#getHardwareWalletTransport.bind(this))),
    ])

    this.bsAggregator = new BSAggregator(services)
    this.blockchainNames = Object.values(services).map(service => service.name)
  }

  static async getServiceAccount({ account, key }: TGetServiceAccountParams) {
    const service = this.bsAggregator.blockchainServicesByName[account.blockchain]
    let serviceAccount: TBSAccount<TBlockchainServiceKey>

    if (account.type === 'hardware' && hasLedger(service)) {
      serviceAccount = await service.generateAccountFromPublicKey(key)

      serviceAccount.isHardware = true
      serviceAccount.bipPath = BSKeychainHelper.getBipPath(service.bipDerivationPath, account.order)
    } else {
      serviceAccount = await service.generateAccountFromKey(key)
    }

    return serviceAccount
  }

  static doesBlockchainSupported(blockchain: string): blockchain is TBlockchainServiceKey {
    return this.blockchainNames.includes(blockchain as TBlockchainServiceKey)
  }
}
