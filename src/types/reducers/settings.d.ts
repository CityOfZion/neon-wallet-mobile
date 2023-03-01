import { Lang } from '~src/enums/Lang'
import { Currency } from '~src/enums/Currency'
import { Theme } from '~src/enums/Theme'
import { Security } from '~/src/enums/Security'
import { TSelectedBlockchainNetworks, TBlockchainNetworks } from '~/src/config/BlockchainConfig'

export interface SettingsState {
  language: Lang
  currency: Currency
  theme: Theme
  security: Security
  isFirstTime: boolean
  blockchainNetworks: TBlockchainNetworks
  selectedBlockchainNetworks: TSelectedBlockchainNetworks
}
