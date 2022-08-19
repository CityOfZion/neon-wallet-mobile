export type WalletType = 'standard' | 'watch' | 'legacy'

export interface WalletState {
  id: string | null
  name: string | null
  walletType: WalletType | null
  lastVisitedAt: string | null
  backupStatus: 'successful' | 'unsuccessful' | 'unsuccessful_with_knowledge'
}
