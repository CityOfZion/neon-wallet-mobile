export interface NetworkOptions {
  name: string
  neoscanBaseUrl: string // e.g. https://api.neoscan.io/api/main_net/v1
  defaultNodeNet: string // e.g. http://seed1.ngd.network:10332
  networkId: '1' | '2'
  networkLabel: '2.x MainNet' | '2.x TestNet'
  networkDeprecatedLabel: 'MainNet' | 'TestNet'
}
