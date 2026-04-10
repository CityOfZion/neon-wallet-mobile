import type { TBSAccount } from '@cityofzion/blockchain-service'
import { BSKeychainHelper, hasLedger } from '@cityofzion/blockchain-service'
import { BSBitcoinConstants } from '@cityofzion/bs-bitcoin'

import { AppError } from './ErrorHelper'
import { I18nextHelper } from './I18nextHelper'
import { SecureStoreHelper } from './SecureStoreHelper'

import type { TBlockchainServiceKey, TBSAggregator } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

const { t } = I18nextHelper.get()

export class BlockchainServiceHelper {
  static bsAggregator: TBSAggregator
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

    const [
      { BSAggregator },
      { BSNeo3 },
      { BSNeoLegacy },
      { BSNeoX },
      { BSBitcoin },
      { BSSolana },
      { BSEthereum },
      { BSStellar },
    ] = await Promise.all([
      import('@cityofzion/bs-multichain'),
      import('@cityofzion/bs-neo3'),
      import('@cityofzion/bs-neo-legacy'),
      import('@cityofzion/bs-neox'),
      import('@cityofzion/bs-bitcoin'),
      import('@cityofzion/bs-solana'),
      import('@cityofzion/bs-ethereum'),
      import('@cityofzion/bs-stellar'),
    ])

    const services = await Promise.all([
      Promise.resolve(new BSNeo3(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoLegacy(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSNeoX(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSStellar(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSSolana(undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(
        new BSBitcoin(
          __DEV__ ? BSBitcoinConstants.TESTNET_NETWORK : undefined,
          this.#getHardwareWalletTransport.bind(this)
        )
      ),
      Promise.resolve(new BSEthereum('ethereum', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('polygon', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('base', undefined, this.#getHardwareWalletTransport.bind(this))),
      Promise.resolve(new BSEthereum('arbitrum', undefined, this.#getHardwareWalletTransport.bind(this))),
    ])

    this.bsAggregator = new BSAggregator(services)
    this.blockchainNames = Object.values(services).map(service => service.name)
  }

  static async getServiceAccount<T extends TBlockchainServiceKey>(account: TAccount<T>): Promise<TBSAccount<T>> {
    const key = await SecureStoreHelper.getKey(account)
    if (!key) throw new AppError(t('common:errors.noKey'))

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

    if (account.type === 'hardware' && hasLedger(service)) {
      const serviceAccount = await service.generateAccountFromPublicKey(key)
      serviceAccount.isHardware = true
      serviceAccount.bipPath = BSKeychainHelper.getBipPath(service.bipDerivationPath, account.order)
      return serviceAccount as TBSAccount<T>
    }

    const serviceAccount = await service.generateAccountFromKey(key)
    return serviceAccount as TBSAccount<T>
  }

  static doesBlockchainSupported(blockchain: string): blockchain is TBlockchainServiceKey {
    return this.blockchainNames.includes(blockchain as TBlockchainServiceKey)
  }
}
