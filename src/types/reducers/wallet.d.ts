export type WalletType = 'standard' | 'watch' | 'legacy'

export interface WalletState {
  id: string | null
  name: string | null
  passphrase: string | null
  securityPhrase: string | null
  walletType: WalletType | null
  lastVisitedAt: string | null
  showBackupAlert: boolean
}
