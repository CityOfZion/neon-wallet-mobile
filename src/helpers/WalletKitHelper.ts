import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import * as ExpoMinimizer from '@raulduartep/expo-minimizer'
import { type IWalletKit, WalletKit } from '@reown/walletkit'
import { Core } from '@walletconnect/core'
import * as ExpoLinking from 'expo-linking'
import { Platform } from 'react-native'

import pkg from '../../package.json'
import { ConstantsHelper } from './ConstantsHelper'
import { StringHelper } from './StringHelper'
import { UtilsHelper } from './UtilsHelper'

import type { TWalletConnectRedirectParams } from '@/types/helpers'

export abstract class WalletKitHelper extends BSWalletKitHelper {
  static kit: IWalletKit

  static async setup() {
    if (this.kit) return

    const core = new Core({
      projectId: '92546a82a052e0a70f22d57fd5764125',
      logger: 'silent',
    })

    this.kit = await WalletKit.init({
      core,
      metadata: {
        name: StringHelper.capitalize(pkg.name),
        description: pkg.description,
        url: ConstantsHelper.cozWebsiteUrl,
        icons: [`${ConstantsHelper.neonIconsUrl}/neon-logo/128x128.png`],
      },
    })
  }

  static async redirect({ metadata, navigation, fromDeeplink }: TWalletConnectRedirectParams) {
    navigation.navigate(
      'TabStack',
      {
        screen: 'DappConnectStack',
        params: {
          screen: 'DappConnectionsScreen',
        },
      },
      { pop: true }
    )

    if (fromDeeplink) {
      await UtilsHelper.sleep(2000)

      if (Platform.OS === 'ios' && parseInt(Platform.Version) >= 17) {
        const redirect = metadata.redirect
        const redirectLink = redirect?.native || redirect?.universal

        if (redirectLink) {
          ExpoLinking.openURL(redirectLink)
        }
        return
      }

      ExpoMinimizer.goBackToPreviousApp()
    }
  }
}
