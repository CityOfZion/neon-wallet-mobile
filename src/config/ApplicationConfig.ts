import {Dimensions} from 'react-native'

import nodesMainNet from '~src/core/nodes-main-net.json'
import nodesTestNet from '~src/core/nodes-test-net.json'
import tokenList from '~src/core/tokenList.json'
import {Currency} from '~src/enums/Currency'

/**
 * Application Configuration
 */
export class ApplicationConfig {
  readonly defaultCurrency = Currency.USD

  readonly headerHeight = 40
  readonly footerHeight = 66

  readonly windowWidth = Dimensions.get('window').width
  readonly windowHeight = Dimensions.get('window').height
  readonly screenWidth = Dimensions.get('screen').width
  readonly screenHeight = Dimensions.get('screen').height

  readonly mainNetworkId = '1'
  readonly mainNetworkLabel = '2.x MainNet'
  readonly mainNetworkDeprecatedLabel = 'MainNet'

  readonly testNetworkId = '2'
  readonly testNetworkLabel = '2.x TestNet'
  readonly testNetworkDeprecatedLabel = 'TestNet'

  readonly tokensMainNet = tokenList
  readonly tokensTestNet: Record<string, string> = {
    DBC: 'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
    RPX: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
    QLC: '0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5',
  }

  readonly nodesMainNet = nodesMainNet
  readonly nodesTestNet = nodesTestNet

  get networkLabels() {
    return [this.mainNetworkLabel, this.testNetworkLabel]
  }
}
