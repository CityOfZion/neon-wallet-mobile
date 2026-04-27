import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { getStateFromPath, type LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

import { I18nextHelper } from './I18nextHelper'
import { ReduxHelper } from './ReduxHelper'
import { ToastHelper } from './ToastHelper'
import { UtilsHelper } from './UtilsHelper'

import type { TRootStackParamList } from '@/types/stacks'

export class ReactNavigationHelper {
  static getLinking(): LinkingOptions<ReactNavigation.RootParamList> {
    const { t } = I18nextHelper.get()
    const {
      settings: {
        data: { isFirstTime },
      },
    } = ReduxHelper.store.getState()

    return {
      prefixes: ['neon://', 'neon3://', 'wc:', Linking.createURL('/', { scheme: 'neon' })],
      getStateFromPath: (path, options) => {
        if (isFirstTime) {
          ToastHelper.error({
            message: t('common:deeplink.errors.firstTime'),
          })

          return
        }

        if (path.startsWith('import?mnemonic=') || path.startsWith('import/?mnemonic=')) {
          const [, base64Mnemonic] = path.split('=')

          try {
            const mnemonic = atob(base64Mnemonic)

            if (BSKeychainHelper.isValidMnemonic(mnemonic)) {
              return getStateFromPath<TRootStackParamList>(`more_screen/${mnemonic}`, {
                screens: {
                  TabStack: {
                    screens: {
                      MoreStack: {
                        screens: {
                          MoreScreen: {
                            path: 'more_screen/:textToImport',
                          },
                        },
                      },
                    },
                  },
                },
              })
            }
          } catch {
            // Empty block
          }
        }

        if (path.startsWith('collect?wif=')) {
          const [, wif] = path.split('=')

          return getStateFromPath<TRootStackParamList>(`import_key/${wif}`, {
            screens: {
              TabStack: {
                screens: {
                  MoreStack: {
                    screens: {
                      ImportScreen: {
                        path: 'import_key/:data',
                      },
                    },
                  },
                },
              },
            },
          })
        }

        const realWCUri = path.split('uri=').pop()
        if (realWCUri) {
          let wcUri: string | undefined

          if (UtilsHelper.isBase64(realWCUri)) {
            wcUri = atob(realWCUri)
          } else {
            wcUri = decodeURIComponent(realWCUri)
          }

          if (WalletKitHelper.isValidURI(wcUri)) {
            return getStateFromPath<TRootStackParamList>(`uri/-/-`, {
              screens: {
                TabStack: {
                  screens: {
                    DappConnectStack: {
                      screens: {
                        DappConnectionsScreen: {
                          path: 'uri/:uri/:fromDeeplink',
                          parse: {
                            uri: (_: string) => wcUri,
                            fromDeeplink: () => true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            })
          }
        }

        return getStateFromPath(path, options)
      },
    }
  }
}
