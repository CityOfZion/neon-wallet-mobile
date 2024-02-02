import { TInitOptions } from '@cityofzion/wallet-connect-sdk-wallet-react'
import i18n from 'i18n-js'
import { QueryClient } from 'react-query'

import { WalletConnectEIP155Adapter } from '../libs/WalletConnectEIP155Adapter'
import { WalletConnectNeonAdapter } from '../libs/WalletConnectNeonAdapter'
import { RootStore } from '../store/RootStore'

export class ContextsConfig {
  readonly walletConnectOptions: TInitOptions = {
    clientOptions: {
      projectId: '31bee1bce685377492bb0b03cbd3a69c',
      metadata: {
        name: i18n.t('walletconnect.metadata.name'),
        description: i18n.t('walletconnect.metadata.description'),
        url: 'https://coz.io/',
        icons: [
          'https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png',
        ],
      },
      logger: 'debug',
      relayUrl: 'wss://relay.walletconnect.com',
    },
    blockchains: {
      neo3: {
        methods: [
          'invokeFunction',
          'testInvoke',
          'signMessage',
          'verifyMessage',
          'getWalletInfo',
          'traverseIterator',
          'getNetworkVersion',
          'encrypt',
          'decrypt',
          'decryptFromArray',
          'calculateFee',
          'signTransaction',
        ],
        autoAcceptMethods: ['testInvoke', 'getWalletInfo', 'traverseIterator', 'getNetworkVersion', 'calculateFee'],
        adapter: new WalletConnectNeonAdapter(),
      },
      eip155: {
        methods: [
          'personal_sign',
          'eth_sign',
          'eth_signTransaction',
          'eth_signTypedData',
          'eth_signTypedData_v3',
          'eth_signTypedData_v4',
          'eth_sendTransaction',
        ],
        events: ['chainChanged', 'accountsChanged'],
        adapter: new WalletConnectEIP155Adapter(),
      },
    },
  }

  readonly store = RootStore.store

  readonly persistor = RootStore.persistor

  readonly queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  })
}
