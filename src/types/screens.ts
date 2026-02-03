import type { EBuyAndSellTokensScreenTabValue } from '@/routes/screens/BuyAndSellTokensScreen'
import type { TSettingsTab } from '@/routes/screens/SettingsScreen'

import type { TBlockchainServiceKey } from './blockchain'
import type { IAccountState, IContactState, IWalletState } from './store'

export type TWalletsScreenParams = {
  wallet?: IWalletState
}

export type TWalletScreenParams = {
  wallet: IWalletState
}

export type TWalletSettingsScreenParams = {
  wallet: IWalletState
}

export type TAccountScreenParams = {
  account: IAccountState
  wallet: IWalletState
}

export type TAccountAssetsScreenParams = {
  account: IAccountState
  wallet: IWalletState
}

export type TAccountTransactionsScreenParams = {
  account: IAccountState
}

export type TAccountConnectionsScreenParams = {
  account: IAccountState
}

export type TAccountNftsScreenParams = {
  account: IAccountState
}

export type TAccountSettingsScreenParams = {
  account: IAccountState
  wallet: IWalletState
}

export type TDappConnectionsScreenParams = {
  uri?: string
  fromDeeplink?: boolean
}

export type TContactScreenParams = {
  contact: IContactState
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
  wallet: IWalletState
}

export type TImportScreen = {
  data: string
}

export type TImportPassphraseScreenParams = {
  encryptedKey: string
  blockchain: TBlockchainServiceKey
}

export type TImportBlockchainSelectionScreenParams = {
  encryptedKey: string
}

export type TImportMnemonicSelectionScreenParams = {
  mnemonic: string
}

export type TImportKeySelectionScreenParams = {
  key: string
}

export type TImportAddressSelectionScreenParams = {
  address: string
}

export type TSendScreenParams = {
  account?: IAccountState
}

export type TSettingsProtocolEditScreen = {
  blockchain: TBlockchainServiceKey
}

export type TSettingsWalletBackupStep1ScreenParams = {
  wallet: IWalletState
}

export type TSettingsWalletBackupStep2ScreenParams = {
  wallet: IWalletState
  words: string[]
}

export type TSettingsWalletBackupStep3ScreenParams = {
  wallet: IWalletState
}

export type TSwapScreenParams = {
  account: IAccountState
}

export type TBuyAndSellTokensScreenParams = {
  account?: IAccountState
  screenType?: EBuyAndSellTokensScreenTabValue
}

export type TVoteNeo3ScreenParams = {
  defaultNeo3Account?: IAccountState
}

export type TBridgeNeo3NeoXScreenParams = {
  account?: IAccountState
}

export type TSettingsScreenParams = {
  tab?: TSettingsTab
}

export type TReceiveScreenParams = {
  account: IAccountState
}
