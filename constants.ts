import {Dimensions} from 'react-native'

import nodesMainNet from '~src/core/nodes-main-net.json'
import nodesTestNet from '~src/core/nodes-test-net.json'
import tokenList from '~src/core/tokenList.json'

export const ROUTES = {
  HOME: {
    id: 'HOME',
    name: 'Home' as 'Home',
  },
  TOUCH_ID_TEST: {
    id: 'TOUCH_ID_TEST',
    name: 'TouchIdTest' as 'TouchIdTest',
  },
  PAGE_TWO: {
    id: 'PAGE_TWO',
    name: 'PageTwo' as 'PageTwo',
  },
  QR_CODE_GENERATE_TEST: {
    id: 'QR_CODE_GENERATE_TEST',
    name: 'QrCodeGenerateTest' as 'QrCodeGenerateTest',
  },
  NEON_JS_TEST: {
    id: 'NEON_JS_TEST',
    name: 'NeonJSTest' as 'NeonJSTest',
  },
  CHART_TEST: {
    id: 'CHART_TEST',
    name: 'ChartTest' as 'ChartTest',
  },
  CONTACTS: {
    id: 'CONTACTS',
    name: 'Contacts' as 'Contacts',
  },
  QUICK_TOOLS: {
    id: 'QUICK_TOOLS',
    name: 'QuickTools' as 'QuickTools',
  },
  QR_CODE_SCAN_TEST: {
    id: 'QR_CODE_SCAN_TEST',
    name: 'QRCodeScanTest' as 'QRCodeScanTest',
  },
  WALLET: {
    id: 'WALLET',
    name: 'Wallet' as 'Wallet',
  },
  THEME_TEST: {
    id: 'THEME_TEST',
    name: 'ThemeTest' as 'ThemeTest',
  },
  CUSTOM_COLOR: {
    id: 'CUSTOM_COLOR',
    name: 'CustomColor' as 'CustomColor',
  },
  SETTINGS: {
    id: 'SETTINGS',
    name: 'Settings' as 'Settings',
  },
  RECEIVE_QR_CODE: {
    id: 'RECEIVE_QR_CODE',
    name: 'ReceiveQRCode' as 'ReceiveQRCode',
  },
  MORE: {
    id: 'MORE',
    name: 'More' as 'More',
  },
  SAMPLE_MODAL: {
    id: 'SAMPLE_MODAL',
    name: 'SampleModal' as 'SampleModal',
  },
}

export const TABS = {
  MAIN_TAB: {
    id: 'MAIN_TAB',
    name: 'MainTab' as 'MainTab',
  },
  ONBOARDING: {
    id: 'ONBOARDING',
    name: 'Onboarding' as 'Onboarding',
  },
}

export const EXPLORERS = {
  NEO_SCAN: 'Neoscan',
  NEO_TRACKER: 'Neotracker',
  ANT_CHAIN: 'Antchain',
}

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
