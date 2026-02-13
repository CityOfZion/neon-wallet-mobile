import storage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import { EnvHelper } from './EnvHelper'
import { AppError } from './ErrorHelper'
import { I18nextHelper } from './I18nextHelper'
import { LoggerHelper } from './LoggerHelper'
import { UtilsHelper } from './UtilsHelper'

const { t } = I18nextHelper.get()

export class AnalyticsHelper {
  static readonly #sessionId: string = Date.now().toString()

  static async #getClientId() {
    let clientId = await storage.getItem('ga_client_id')

    if (!clientId) {
      clientId = UtilsHelper.uuid()
      await storage.setItem('ga_client_id', clientId)
    }

    return clientId
  }

  static async logEvent(eventName: string, params: Record<string, any> = {}) {
    if (__DEV__) {
      LoggerHelper.warn(`Analytics event skipped in non-production environment: ${eventName}`, {
        where: 'AnalyticsHelper',
        operation: 'logEvent',
      })
      return
    }

    const clientId = await this.#getClientId()

    try {
      const response = await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${EnvHelper.EXPO_PUBLIC_GA_MEASUREMENT_ID}&api_secret=${EnvHelper.EXPO_PUBLIC_GA_API_SECRET}`,
        {
          client_id: clientId,
          consent: { ad_personalization: 'DENIED' },
          events: [
            {
              name: eventName,
              // If you want to test, you should also send debug_mode: 1 in the params object
              params: { ...params, session_id: this.#sessionId, engagement_time_msec: 100 },
            },
          ],
        }
      )

      if (response.status !== 204) {
        throw new AppError(t('errors.analyticsEventLoggingFailed'))
      }
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'AnalyticsHelper', operation: 'logEvent' })
    }
  }
}
