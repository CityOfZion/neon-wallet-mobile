import {TokenValue} from '~src/models/TokenValue'

const iconDBC = require('~src/assets/logos/icon_DBC.png')
const iconONT = require('~src/assets/logos/icon_ONT.png')
const iconNEO = require('~src/assets/logos/logo-neo.png')
const iconRPX = require('~src/assets/logos/rpx_icon.png')

export const mockListTokenModal: TokenValue[] = [
  new TokenValue('Neo', 'NEO', 1234, 0, null, iconNEO),
  new TokenValue('Dbc', 'DBC', 654, 0, null, iconDBC),
  new TokenValue('Ont', 'ONT', 1234, 0, null, iconONT),
  new TokenValue('Rpx', 'RPX', 6546, 0, null, iconRPX),
]
