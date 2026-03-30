import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { SkinHelper } from '@/helpers/SkinHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import type { TAccount } from '@/types/store'

export function getAccountsMigrations() {
  return {
    0: (state: any) => {
      return {
        ...state,
        data: state.data.map((account: any, _index: number, accounts: any[]) => {
          const filteredAccounts = accounts.filter(
            ({ idWallet, blockchain }) => idWallet === account.idWallet && blockchain === account.blockchain
          )

          return {
            ...account,
            type: account.accountType,
            accountType: undefined,
            id: UtilsHelper.uuid(),
            order: filteredAccounts.findIndex(({ id }) => id === account.id),
          }
        }),
      }
    },
    1: (state: any) => {
      return {
        ...state,
        swapRecords: [],
        data: state.data.map((account: any) => {
          account.skin = { id: account.backgroundColor || SkinHelper.getSkinColor(), type: 'color' }
          account.type = account.type === 'legacy' ? 'standard' : account.type

          delete account.backgroundColor

          return account
        }),
      }
    },
    2: (state: any) => {
      delete state.swapRecords
      delete state.unlockedSkinIds
      return state
    },
    3: async (state: any) => {
      const fixedAccounts: TAccount[] = []

      for (const account of state.data as TAccount[]) {
        if (account.type) {
          fixedAccounts.push(account)
          continue
        }

        const key = await SecureStoreHelper.getKey(account)

        if (!key) {
          fixedAccounts.push({ ...account, type: 'watch' })
          continue
        }

        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
        const isPrivateKey = service.validateKey(key)

        fixedAccounts.push({ ...account, type: isPrivateKey ? 'standard' : 'watch' })
      }

      return {
        ...state,
        data: fixedAccounts,
      }
    },
  }
}
