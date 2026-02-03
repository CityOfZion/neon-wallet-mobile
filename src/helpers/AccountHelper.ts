import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccountHelperPredicateParams } from '@/types/helpers'
import type { IAccountState } from '@/types/store'

export class AccountHelper {
  static predicate({ address, blockchain }: TAccountHelperPredicateParams) {
    return (account: TAccountHelperPredicateParams) => address === account.address && blockchain === account.blockchain
  }

  static predicateNot({ address, blockchain }: TAccountHelperPredicateParams) {
    return (account: TAccountHelperPredicateParams) => address !== account.address || blockchain !== account.blockchain
  }

  static getNextOrderOrMissing(accounts: IAccountState[], blockchain: TBlockchainServiceKey, walletId: string) {
    const orders = accounts
      .filter(account => account.idWallet === walletId && account.blockchain === blockchain)
      .map(({ order }) => order)

    if (orders.length === 0) return 0

    const maxOrder = Math.max(...orders)

    for (let index = 0; index <= maxOrder; index++) if (!orders.includes(index)) return index

    return maxOrder + 1
  }

  static buildAccountKey({ address, blockchain }: TAccountHelperPredicateParams) {
    return `${address}-${blockchain}`
  }
}
