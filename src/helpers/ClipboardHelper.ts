import * as Clipboard from 'expo-clipboard'

import { I18nextHelper } from '@/helpers/I18nextHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

const { t } = I18nextHelper.get()

export class ClipboardHelper {
  static write(content?: string, message = t('common:general.copiedToClipboard')) {
    if (content) {
      Clipboard.setStringAsync(content)

      ToastHelper.success({ message })
    }
  }

  static async get() {
    return await Clipboard.getStringAsync()
  }
}
