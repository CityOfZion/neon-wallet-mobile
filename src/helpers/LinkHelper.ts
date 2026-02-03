import * as WebBrowser from 'expo-web-browser'

import { AppError } from './ErrorHelper'
import { I18nextHelper } from './I18nextHelper'
import { LoggerHelper } from './LoggerHelper'

const { t } = I18nextHelper.get()

export class LinkHelper {
  static async open(link: string) {
    try {
      await WebBrowser.openBrowserAsync(link)
    } catch (error) {
      LoggerHelper.error(error, { where: 'LinkHelper', operation: 'open' })
      throw new AppError(t('common:general.errorOpenLink'), error)
    }
  }
}
