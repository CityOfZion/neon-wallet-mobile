import {Wallet} from '~src/models/Wallet'
import {TokenBalance} from '~src/models/TokenBalance'
import {TokenValue} from '~src/models/TokenValue'

export const mockWalletItems = [
  new Wallet(
    'Wallet 1',
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 199, 2111.39, 'primary'),
      new TokenValue('GAS', 'GAS', 1405, 665, 'secondary'),
      new TokenValue('MYCOIN', 'MC', 45, 65, 'salmon'),
      new TokenValue('THECOIN', 'TC', 415, 965, 'red'),
    ]),
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 199, 2221.39, 'primary'),
      new TokenValue('GAS', 'GAS', 1405, 701, 'secondary'),
      new TokenValue('MYCOIN', 'MC', 45, 55, 'salmon'),
      new TokenValue('THECOIN', 'TC', 415, 1865, 'red'),
    ])
  ),
  new Wallet(
    'Wallet 2',
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 199, 2111.39),
      new TokenValue('GAS', 'GAS', 105, 665),
      new TokenValue('MYCOIN', 'MC', 45, 65),
      new TokenValue('THECOIN', 'TC', 415, 965),
    ]),
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 199, 2221.39, 'secondary'),
      new TokenValue('GAS', 'GAS', 705, 701, 'primary'),
      new TokenValue('MYCOIN', 'MC', 0, 55, '#555'),
      new TokenValue('THECOIN', 'TC', 0, 1865, 'red'),
    ])
  ),
  new Wallet(
    'Wallet 3',
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 19, 2111.39),
      new TokenValue('GAS', 'GAS', 15, 665),
      new TokenValue('MYCOIN', 'MC', 15, 65),
      new TokenValue('THECOIN', 'TC', 115, 965),
    ]),
    new TokenBalance([
      new TokenValue('NEO', 'NEO', 19, 2221.39, '#a82912'),
      new TokenValue('GAS', 'GAS', 140, 701, '#442311'),
      new TokenValue('MYCOIN', 'MC', 25, 55, '#987654'),
      new TokenValue('THECOIN', 'TC', 315, 1865, '#287213'),
    ])
  ),
]
