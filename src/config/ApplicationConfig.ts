import {Dimensions, Platform} from 'react-native'

import nodesMainNet from '~src/core/nodes-main-net.json'
import nodesTestNet from '~src/core/nodes-test-net.json'
import tokenList from '~src/core/tokenList.json'
import {Theme} from '~src/enums/Theme'

/**
 * Application Configuration
 */
export class ApplicationConfig {
  readonly defaultTheme = Theme.DARK

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

  readonly mainNetworkId = '1'
  readonly mainNetworkLabel = '2.x MainNet'
  readonly mainNetworkDeprecatedLabel = 'MainNet'

  readonly testNetworkId = '2'
  readonly testNetworkLabel = '2.x TestNet'
  readonly testNetworkDeprecatedLabel = 'TestNet'

  readonly tokensMainNet = tokenList

  readonly nodesMainNet = nodesMainNet
  readonly nodesTestNet = nodesTestNet

  readonly neoHash =
    'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'

  readonly gasHash =
    '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

  get networkLabels() {
    return [this.mainNetworkLabel, this.testNetworkLabel]
  }
}
