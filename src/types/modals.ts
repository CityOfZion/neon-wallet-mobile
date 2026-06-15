import type {
  IBlockchainService,
  TBridgeToken,
  TBSBridgeName,
  TBSToken,
  TTransactionUtxo,
  TTransferIntent,
} from '@cityofzion/blockchain-service'
import type { TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import type { TBSNeo3Name, TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import type { TBSStellarName } from '@cityofzion/bs-stellar'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, ProposalTypes, SessionTypes } from '@walletconnect/types'
import type { Dispatch, ReactNode } from 'react'

import type { TTwBannerProps } from '@/components/TwBanner'
import type { TTwButtonProps } from '@/components/TwButton'
import type { TTwInputProps } from '@/components/TwInput'

import type { TDepositActionsData } from '@/routes/screens/BuyAndSellTokensScreen'

import type { TBlockchainServiceKey, TNetwork } from './blockchain'
import type { TUseTransactionsTransaction } from './hooks'
import type { TTokenBalance, TUseBalanceOptionShowType } from './query'
import type { TRootStackScreenProps } from './stacks'
import type {
  TAccount,
  TAccountType,
  TContact,
  TContactAddress,
  TNotification,
  TSwapRecord,
  TWallet,
  TWalletType,
} from './store'

export type TOnboardingBackupMnemonicModalParams = {
  wallet: TWallet
  onSuccess: () => void
}

export type TOnboardingImportModalParams = {
  onConfirm: () => void
}

export type TEditAccountModalParams = {
  account: TAccount
}

export type TAccountQRCodeModalParams = {
  account: TAccount
}

export type TWalletContextModalParams = {
  wallet?: TWallet
}

export type TPersistContactModalParams = {
  contact?: TContact
  addresses?: TContactAddress[]
}

export type TPersistContactAddressModalParams = {
  address?: TContactAddress
  onAdd: (address: TContactAddress) => void
}

export type TBlockchainSelectionModalParams = {
  title?: string
  description?: string
  isMulti?: boolean
  buttonProps?: TTwButtonProps
  onSelect: (blockchain: TBlockchainServiceKey[]) => void
}

export type TEditWalletModalParams = {
  wallet: TWallet
}

export type TPersistNetworkModalParams = {
  blockchain: TBlockchainServiceKey
  network?: TNetwork
}

export type TExportKeyModalParams = {
  account: TAccount
}

export type TBackupAlertModalParams = {
  wallet: TWallet
}

export type TQRCodeAddressContextModalParams = {
  address: string
}

export type TWalletSelectionModalParams = {
  onSelect: (wallet: TWallet) => void
  onRequestClose?: () => void
  blockchains?: TBlockchainServiceKey[]
  title?: string
  description?: string
  walletTypes?: TWalletType[]
  accountTypes?: TAccountType[]
}

export type TTokenSelectionModalToken = {
  symbol: string
  imageUrl?: string
  hash?: string
  network?: string
  blockchain?: TBlockchainServiceKey
  amount?: string
}

export type TTokenSelectionModalParams<T extends TTokenSelectionModalToken = TTokenSelectionModalToken> = {
  tokens: T[]
  selectedToken?: T
  onSelect(token: T): void
  account?: TAccount
  title?: string
  blockchain?: TBlockchainServiceKey
}

export type TCreateAccountBlockchainSelectionModalParams = {
  wallet: TWallet
}

export type TDappConnectionModalParams = {
  uri?: string
  fromDeeplink?: boolean
  account?: TAccount
}

export type TDappConnectionRequestModalParams = {
  proposal: ProposalTypes.Struct
  account: TAccount
  fromDeeplink?: boolean
}

export type TAccountStackListSelectionModalParams = {
  wallet: TWallet
  title: string
  description: string
  onSelect(account: TAccount): void
  blockchains?: TBlockchainServiceKey[]
  onRequestClose?: () => void
  accountTypes?: TAccountType[]
}

export type TDappConnectionDetailsModalParams = {
  session: SessionTypes.Struct
}

export type TDappPermissionModalParams = {
  session: SessionTypes.Struct
  request: PendingRequestTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails
  sessionAccount: TAccount
  onReject: (reason?: ErrorResponse) => Promise<void>
  onAccept: () => Promise<any>
}

export type TDappPermissionContractDetailsModalParams = {
  session: SessionTypes.Struct
  hash: string
  operation: string
  blockchain: TBlockchainServiceKey
  values: any[]
}

export type TDappPermissionSignatureScopeModalParams = {
  session: SessionTypes.Struct
  scope: string
  allowedList?: string[]
}

export type TSendTipUncheckedConfirmationModalParams = {
  onConfirmation: (value: boolean) => void
}

export type TSendConfirmModalParams = {
  intents: TTransferIntent[]
  fee?: string
  service: IBlockchainService<TBlockchainServiceKey>
  onConfirm: (navigation: TRootStackScreenProps<'SendConfirmModal'>['navigation']) => Promise<void>
}

export type TAccountSelectionModalParams = {
  title?: string
  onSelect: (account: TAccount, wallet: TWallet) => void
  blockchains?: TBlockchainServiceKey[]
}

export type TAddressSelectionModalParams = {
  title?: string
  onSelect: (address: string) => void
  blockchain?: TBlockchainServiceKey
}

export type TSwapDetailsModalParams = {
  swapRecord: TSwapRecord
}

export type TSwapDetailsLogModalParams = {
  swapRecord: TSwapRecord
}

export type TPasswordModalParams = {
  title: string
  description?: string
  buttonProps?: TTwButtonProps
  inputProps?: TTwInputProps
  bannerProps?: TTwBannerProps
  onConfirm: (password: string) => Promise<void> | void
  onSuccess: () => Promise<void> | void
  onError?: (error: Error) => Promise<void> | void
  onRequestClose?: () => void
}

export type TSuccessModalParams = {
  title: string
  className?: string
  titleClassName?: string
  content: ReactNode
  buttonLabel?: string
  onClose?(): void
}

export type TErrorModalParams = {
  title: string
  content: ReactNode
  buttonLabel?: string
  onClose?(): void
}

export type TBuyAndSellTokensAccountsModalParams = {
  account?: TAccount
}

export type TSellTokensDepositModalParams = {
  depositActionsData: TDepositActionsData | null
  setDepositActionsData: Dispatch<TDepositActionsData | null>
  account?: TAccount
}

export type TSellTokensDepositSuccessModalParams = {
  transaction: TUseTransactionsTransaction
}

export type TNotificationContextModalParams = {
  notification: TNotification
}

export type TAccountAssetTokenActionsModalParams = {
  tokenBalance: TTokenBalance
  showType: TUseBalanceOptionShowType
}

export type TAccountTransactionsContextModalParams = {
  account: TAccount
  dateFrom: Date
  dateTo: Date
  onDatesChange: (dateFrom: Date, dateTo: Date) => void
}

export type TAccountTransactionsUtxoDetailsModalParams = {
  transaction: TTransactionUtxo<TBlockchainServiceKey>
}

export type TAccountAssetActionsModalParams = {
  account: TAccount
  wallet: TWallet
}

export type TNetworkUrlSelectionModalParams = {
  blockchain: TBlockchainServiceKey
}

export type TExportFullTransactionsModalParams = {
  account?: TAccount
}

export type TDateSelectionModalParams = {
  title: string
  description: string
  dateFrom: Date
  dateTo: Date
  onSelect: (dateFrom: Date, dateTo: Date) => void
}

export type TNeo3VoteSupportUsModalParams = {
  neo3Account: TAccount<TBSNeo3Name>
  cozCandidate: TVoteServiceCandidate
}

export type TNeo3VoteConfirmationModalParams = {
  neo3Account: TAccount<TBSNeo3Name>
  candidate: TVoteServiceCandidate
}

export type TNeo3VoteCandidateDetailsModalParams = {
  neo3Account?: TAccount<TBSNeo3Name>
  candidate: TVoteServiceCandidate
  candidateVotePercentage: string
}

export type TCreatePasswordModalParams = {
  title: string
  description?: string
  formDescription?: string
  passwordInputProps?: TTwInputProps
  confirmPasswordInputProps?: TTwInputProps
  buttonProps?: TTwButtonProps
  bannerProps?: TTwBannerProps
  onCreate: (password: string) => Promise<void> | void
  onSuccess: () => Promise<void> | void
  onError?: (error: Error) => Promise<void> | void
  onRequestClose?: () => void
}

export type TRemoveNfiModalParams = {
  onError?: (error?: Error) => Promise<void> | void
  onSuccess: () => Promise<void> | void
}

export type THideFraudulentTokenModalParams = {
  account: TAccount
  hash: string
}

export type TNeo3NeoXBridgeConfirmationModalParams = {
  tokenToUse: TBridgeToken<TBSBridgeName>
  tokenToReceive: TBridgeToken<TBSBridgeName>
  accountToUse: TAccount
  amountToUse: string
  amountToReceive: string
  addressToReceive: string
  bridgeFee: string
  fromService: IBlockchainService<TBSBridgeName>
  onSubmit: (navigation: NativeStackNavigationProp<any>) => Promise<void>
}

export type TImportAddressSelectionModalParams = {
  address: string
  onSuccess: () => void
}

export type TImportMnemonicSelectionModalParams = {
  mnemonic: string
  onSuccess: () => void
}

export type TImportKeySelectionModalParams = {
  key: string
  onSuccess: () => void
}

export type TImportEncryptedKeySelectionModalParams = {
  encryptedKey: string
  onSuccess: () => void
}

export type TNeo3NeoXBridgeDetailsModalParams = {
  tokenToUse: TBridgeToken<TBSBridgeName>
  tokenToReceive: TBridgeToken<TBSBridgeName>
  accountToUse: TAccount
  amountToUse: string
  amountToReceive: string
  addressToReceive: string
  transactionHash?: string
  confirmed?: boolean
}

export type TStellarPersistTrustlineModalParams = {
  limit?: string
  token?: TBSToken
  stellarAccount: TAccount<TBSStellarName>
}

export type TStellarTrustilneTokenSelectionModalParams = {
  onSelect: (token: TBSToken) => void
}
