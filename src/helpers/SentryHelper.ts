import * as Sentry from '@sentry/react-native'
import type { ComponentType } from 'react'

import { EnvHelper } from './EnvHelper'

import type { TSentryHelperOptions } from '@/types/helpers'

export class SentryHelper {
  static capture(error: unknown, options: TSentryHelperOptions) {
    if (__DEV__) return

    Sentry.captureException(error, {
      level: options?.level,
      tags: { where: options?.where, operation: options?.operation },
    })
  }

  static setup(RootComponent: ComponentType<Record<string, unknown>>) {
    if (__DEV__) {
      return RootComponent
    }

    Sentry.init({
      dsn: EnvHelper.EXPO_PUBLIC_SENTRY_DSN,
      sendDefaultPii: false,
    })

    return Sentry.wrap(RootComponent)
  }
}
