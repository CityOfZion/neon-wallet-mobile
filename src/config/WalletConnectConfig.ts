import { SessionTypes } from '@walletconnect/types'

import { BlockchainServiceKey } from '../blockchain'

export class WalletConnectConfig {
  defaultRelayURL = 'wss://relay.walletconnect.com'

  defaultMethods = ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage', 'traverseIterator', 'getWalletInfo']

  defaultAutoacceptMethods = ['testInvoke', 'traverseIterator', 'getWalletInfo']

  defaultLogger = 'debug'

  defaultProjectId = '31bee1bce685377492bb0b03cbd3a69c'

  defaultAppMetadata = {
    name: 'Neon Wallet Mobile',
    description:
      'Mobile version of the highly acclaimed Neon Wallet for the Neo Blockchain. Create and organize wallets, or easily import your existing ones, to safely manage and transfer your assets across multiple accounts with Neon’s slick interface.',
    url: 'https://coz.io/',
    icons: [
      'https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png',
    ],
  }

  defaultChain = 'neo3:mainnet'

  defaultNetworks = {
    'neo3:testnet': 'https://testnet1.neo.coz.io:443',
    'neo3:mainnet': 'http://seed1.neo.org:10332',
    'neo3:private': null,
  }

  defaultBlockchain = 'neo3'

  defaultNamespace: SessionTypes.Namespaces = {
    [this.defaultBlockchain]: {
      accounts: [], // will be overridden
      methods: this.defaultMethods,
      events: [],
    },
  }

  blockchainsByBlockchainServiceKey: Partial<Record<BlockchainServiceKey, string>> = {
    neo3: 'neo3',
  }
}

export const walletConnectConfig = new WalletConnectConfig()
