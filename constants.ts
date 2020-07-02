import {Dimensions} from 'react-native'

import nodesMainNet from '~src/core/nodes-main-net.json'
import nodesTestNet from '~src/core/nodes-test-net.json'
import tokenList from '~src/core/tokenList.json'

export const MAIN_NETWORK_ID = '1'
export const MAIN_NETWORK_LABEL = '2.x MainNet'
export const MAIN_NETWORK_DEPRECATED_LABEL = 'MainNet'

export const TEST_NETWORK_ID = '2'
export const TEST_NETWORK_LABEL = '2.x TestNet'
export const TEST_NETWORK_DEPRECATED_LABEL = 'TestNet'

export const NETWORK_LABELS = [MAIN_NETWORK_LABEL, TEST_NETWORK_LABEL]

export const TOKENS_MAIN_NET = tokenList
export const TOKENS_TEST_NET = {
  DBC: 'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
  RPX: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
  QLC: '0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5',
}

export const NODES_MAIN_NET = nodesMainNet
export const NODES_TEST_NET = nodesTestNet

export const DEFAULT_CURRENCY = '$'

export const WINDOW_WIDTH = Dimensions.get('window').width
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height

export const HEADER_HEIGHT = 40
export const FOOTER_HEIGHT = 66

export const defaultScreenOptions = {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  transparentCard: true,
  transitionConfig: () => ({
    containerStyle: {
      backgroundColor: 'transparent',
    },
  }),
  animationEnabled: false,
}
