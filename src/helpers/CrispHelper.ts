import * as crispSdk from 'crisp-sdk-react-native'

import { EnvHelper } from '@/helpers/EnvHelper'

export class CrispHelper {
  static setup() {
    crispSdk.configure(EnvHelper.EXPO_PUBLIC_CRISP_WEBSITE_ID)
  }

  static show() {
    crispSdk.openChat()
  }

  static startNegativeFeedbackChat(message: string) {
    crispSdk.setSessionSegment('negative-survey')
    crispSdk.pushSessionEvent('Negative survey feedback', crispSdk.CrispSessionEventColors.RED)
    crispSdk.showMessage({ type: 'text', text: message })
    crispSdk.openChat()
  }
}
