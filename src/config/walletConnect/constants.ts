import { SessionTypes } from '@walletconnect/types'

export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com'

export const DEFAULT_METHODS = ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage']

export const DEFAULT_AUTOACCEPT_METHODS = ['testInvoke']

export const DEFAULT_LOGGER = 'debug'

export const DEFAULT_PROJECT_ID = '31bee1bce685377492bb0b03cbd3a69c'

export const DEFAULT_APP_METADATA = {
  name: 'Neon Wallet Mobile',
  description:
    'Mobile version of the highly acclaimed Neon Wallet for the Neo Blockchain. Create and organize wallets, or easily import your existing ones, to safely manage and transfer your assets across multiple accounts with Neon’s slick interface.',
  url: 'https://coz.io/',
  icons: [
    'https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png',
  ],
}

export const DEFAULT_CHAIN = 'neo3:mainnet'
export const DEFAULT_NETWORKS = {
  'neo3:testnet': 'https://testnet1.neo.coz.io:443',
  'neo3:mainnet': 'http://seed1.neo.org:10332',
  'neo3:private': null,
}

export const DEFAULT_BLOCKCHAIN = 'neo3'

export const DEFAULT_NAMESPACES: SessionTypes.Namespaces = {
  [DEFAULT_BLOCKCHAIN]: {
    accounts: [], // will be overridden
    methods: [...DEFAULT_METHODS],
    events: [],
  },
}
