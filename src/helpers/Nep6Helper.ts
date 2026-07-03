import { hasEncryption } from '@cityofzion/blockchain-service'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'
import { I18nextHelper } from './I18nextHelper'

import type { TUseImportNep6Account, TUseImportNep6DecryptedAccount } from '@/types/hooks'

const { t } = I18nextHelper.get()

type TTransformAccountsImportAccountRaw = {
  address?: string | null
  label?: string | null
  key?: string | null
}

export class Nep6Helper {
  static transformAccounts(accounts: TTransformAccountsImportAccountRaw[]): TUseImportNep6Account[] {
    const transformedAccounts: TUseImportNep6Account[] = []

    accounts.forEach(({ label, address, key }) => {
      if (!address || !key) return

      const blockchains = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)

      if (blockchains.length === 0) return

      blockchains.forEach(blockchain => {
        if (
          transformedAccounts.some(
            account => (account.address === address || account.key === key) && account.blockchain === blockchain
          )
        ) {
          return
        }

        transformedAccounts.push({
          address,
          key,
          label: label || t('common:wallet.migratedAccountLabel'),
          blockchain,
        })
      })
    })

    return transformedAccounts
  }

  static async decryptAccount(
    account: TUseImportNep6Account,
    password: string
  ): Promise<TUseImportNep6DecryptedAccount | undefined> {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

    if (!hasEncryption(service)) return undefined

    const decryptedAccount = await service.decrypt(account.key, password)

    return {
      ...account,
      decryptedKey: decryptedAccount.key,
    }
  }
}
