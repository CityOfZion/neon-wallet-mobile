import { EBuyAndSellTokensScreenTabValue } from '../BuyAndSellTokensScreen'

import type { TSearchStackScreenProps } from '@/types/stacks'

type TFunctionParams = {
  navigation: TSearchStackScreenProps<'SearchScreen'>['navigation']
}

type TFunctionsByActionId = {
  [K in string]: (params: TFunctionParams) => Promise<void>
}

export const functionsByActionId: TFunctionsByActionId = {
  transfer: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'SendScreen' },
    })
  },
  receive: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'ReceiveScreen' },
    })
  },
  connect: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'DappConnectStack',
      params: { screen: 'DappConnectionsScreen' },
    })
    navigation.navigate('DappConnectionModal')
  },
  createContact: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'ContactsScreen' },
    })
    navigation.navigate('PersistContactModal')
  },
  viewContacts: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'ContactsScreen' },
    })
  },
  swap: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'SwapScreen' },
    })
  },
  buy: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'BuyAndSellTokensScreen', params: { screenType: EBuyAndSellTokensScreenTabValue.BUY_TOKENS } },
    })
  },
  sell: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'BuyAndSellTokensScreen', params: { screenType: EBuyAndSellTokensScreenTabValue.SELL_TOKENS } },
    })
  },
  createWallet: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'CreateWalletStep1Screen' },
    })
  },
  createBackup: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'MoreScreen' },
    })
    navigation.navigate('CreateBackupModal')
  },
  restoreBackup: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'MoreScreen' },
    })
    navigation.navigate('ImportBackupModal')
  },
  import: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: { screen: 'ImportScreen' },
    })
  },
  connectHardwareWallet: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'WalletsScreen' },
    })
    navigation.navigate('ConnectHardwareTypeSelectionModal')
  },
  exportFullTransactions: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'WalletsScreen' },
    })
    navigation.navigate('ExportFullTransactionsModal')
  },
  voteNeo3: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'VoteNeo3Screen', params: { defaultNeo3Account: undefined } },
    })
  },
  bridgeNeo3NeoX: async ({ navigation }) => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: { screen: 'BridgeNeo3NeoXScreen', params: { account: undefined } },
    })
  },
}
