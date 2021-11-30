export const DEFAULT_RELAY_PROVIDER = 'wss://relay.walletconnect.org'

export const DEFAULT_METHODS = [
  'invokefunction',
  'testInvoke',
  'multiInvoke',
  'multiTestInvoke',
]

export const DEFAULT_LOGGER = 'debug'

export const DEFAULT_APP_METADATA = {
  name: 'Neon Wallet Mobile',
  description: 'Mobile version of the highly acclaimed Neon Wallet for the Neo Blockchain. Create and organize wallets, or easily import your existing ones, to safely manage and transfer your assets across multiple accounts with Neon’s slick interface.',
  url: 'https://coz.io/',
  icons: ['file:../../../assets/ic_launcher.png'],
}

export const DEFAULT_CHAIN = 'neo3:mainnet'
export const DEFAULT_NETWORKS = {
  'neo3:testnet': 'https://testnet1.neo.coz.io:443',
  'neo3:mainnet': 'http://seed1.neo.org:10332',
  'neo3:private': null,
}
