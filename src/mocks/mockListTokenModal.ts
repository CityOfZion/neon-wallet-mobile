import {TokenValue} from '~src/models/TokenValue'

const iconNEO = require('~src/assets/logos/logo-neo.png')

export const mockListTokenModal: TokenValue[] = [
  new TokenValue('Neo', 'NEO', 1234, 0, null, iconNEO),
  new TokenValue('Dbc', 'DBC', 654, 0, null, iconNEO),
  new TokenValue('Ont', 'ONT', 1234, 0, null, iconNEO),
  new TokenValue('Rpx', 'RPX', 6546, 0, null, iconNEO),
]
