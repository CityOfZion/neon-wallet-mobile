import * as crispSdk from 'crisp-sdk-react-native'

import { EnvHelper } from '@/helpers/EnvHelper'

export class CrispHelper {
  static setup() {
    crispSdk.configure(EnvHelper.EXPO_PUBLIC_CRISP_WEBSITE_ID)
  }

  static show() {
    crispSdk.openChat()
  }
}
