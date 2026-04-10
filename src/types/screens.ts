import type { TBSBridgeName } from '@cityofzion/blockchain-service'
import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import type { TBSStellarName } from '@cityofzion/bs-stellar'

import type { EBuyAndSellTokensScreenTabValue } from '@/routes/screens/BuyAndSellTokensScreen'
import type { TSettingsTab } from '@/routes/screens/SettingsScreen'

import type { TBlockchainServiceKey } from './blockchain'
import type { TAccount, TContact, TWallet } from './store'

export type TOnboardingCompletedScreenParams = {
  isImport?: boolean
}

export type TWalletsScreenParams = {
  wallet?: TWallet
}

export type TWalletScreenParams = {
  wallet: TWallet
}

export type TWalletSettingsScreenParams = {
  wallet: TWallet
}

export type TAccountScreenParams = {
  account: TAccount
  wallet: TWallet
}

export type TAccountAssetsScreenParams = {
  account: TAccount
  wallet: TWallet
}

export type TAccountTransactionsScreenParams = {
  account: TAccount
}

export type TAccountConnectionsScreenParams = {
  account: TAccount
}

export type TAccountNftsScreenParams = {
  account: TAccount
}

export type TAccountSettingsScreenParams = {
  account: TAccount
  wallet: TWallet
}

export type TDappConnectionsScreenParams = {
  uri?: string
  fromDeeplink?: boolean
}

export type TContactScreenParams = {
  contact: TContact
}

export type TMoreScreenParams = {
  textToImport?: string
  isHelpAccordionOpen?: boolean
}

export type TCreateWalletStep3ScreenParams = {
  words: string[]
}

export type TCreateWalletStep4ScreenParams = {
  hasBackup?: boolean
  mnemonic: string
}

export type TCreateWalletStep5ScreenParams = {
  mnemonic: string
  name: string
  hasBackup?: boolean
}

export type TCreateWalletStep6ScreenParams = {
  wallet: TWallet
}

export type TImportScreen = {
  data: string
}

export type TSendScreenParams = {
  account?: TAccount
}

export type TSettingsProtocolEditScreen = {
  blockchain: TBlockchainServiceKey
}

export type TSettingsWalletBackupStep1ScreenParams = {
  wallet: TWallet
}

export type TSettingsWalletBackupStep2ScreenParams = {
  wallet: TWallet
  words: string[]
}

export type TSettingsWalletBackupStep3ScreenParams = {
  wallet: TWallet
}

export type TSwapScreenParams = {
  account: TAccount
}

export type TBuyAndSellTokensScreenParams = {
  account?: TAccount
  screenType?: EBuyAndSellTokensScreenTabValue
}

export type TNeo3VoteScreenParams = {
  defaultNeo3Account?: TAccount<TBSNeo3Name>
}

export type TNeo3NeoXBridgeScreenParams = {
  account?: TAccount<TBSBridgeName>
}

export type TSettingsScreenParams = {
  tab?: TSettingsTab
}

export type TReceiveScreenParams = {
  account: TAccount
}

export type TStellarTrustlineScreenParams = {
  stellarAccount: TAccount<TBSStellarName>
}
