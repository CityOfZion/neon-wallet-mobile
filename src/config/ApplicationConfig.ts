import {Dimensions, Platform} from 'react-native'

import nodesMainNet from '~src/core/nodes-main-net.json'
import nodesTestNet from '~src/core/nodes-test-net.json'
import tokenList from '~src/core/tokenList.json'
import {Theme} from '~src/enums/Theme'
import {NetworkOptions} from '~src/types/settings'

/**
 * Application Configuration
 */
export class ApplicationConfig {
  readonly defaultTheme = Theme.DARK
  readonly defaultDataRefreshTimeInMilliseconds = 90000

  readonly headerHeight = Platform.OS === 'ios' ? 40 : 72
  readonly footerHeight = 66

  readonly windowWidth = Dimensions.get('window').width
  readonly windowHeight = Dimensions.get('window').height
  readonly screenWidth = Dimensions.get('screen').width
  readonly screenHeight = Dimensions.get('screen').height

  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'

  readonly assets = 'NEO,GAS'
  readonly currencies = 'USD,EUR,BRL'

  // from ~src/core
  readonly tokensMainNet = tokenList
  readonly nodesMainNet = nodesMainNet
  readonly nodesTestNet = nodesTestNet

  readonly neoHash =
    'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'

  readonly gasHash =
    '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

  get mainNetwork(): NetworkOptions {
    return {
      name: 'Main',
      neoscanBaseUrl: 'https://api.neoscan.io/api/main_net/v1',
      defaultNodeNet: 'http://seed1.ngd.network:10332', // fallback
      networkId: '1',
      networkLabel: '2.x MainNet',
      networkDeprecatedLabel: 'MainNet',
    }
  }

  get testNetwork(): NetworkOptions {
    return {
      name: 'Test',
      neoscanBaseUrl: 'https://neoscan-testnet.io/api/test_net/v1',
      defaultNodeNet: 'http://seed1.ngd.network:20332', // fallback
      networkId: '2',
      networkLabel: '2.x TestNet',
      networkDeprecatedLabel: 'TestNet',
    }
  }
}
