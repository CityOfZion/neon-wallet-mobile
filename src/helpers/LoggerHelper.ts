import * as ReactNativeLogs from 'react-native-logs'

import { NumberHelper } from './NumberHelper'
import { SentryHelper } from './SentryHelper'
import { StringHelper } from './StringHelper'

import type { TLoggerHelperOptions } from '@/types/helpers'

export class LoggerHelper {
  // prettier-ignore
  static allColors = [
    'blueBright', 'greenBright', 'yellowBright', 'redBright',
    'default', 'black', 'red', 'green',
    'yellow', 'blue', 'magenta', 'cyan',
    'white', 'grey', 'magentaBright', 'cyanBright',
    'whiteBright',
  ]
  static extensionColors: Record<string, any> = {}
  static #logger = ReactNativeLogs.logger.createLogger({
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    transport: ReactNativeLogs.consoleTransport,
    transportOptions: {
      colors: {
        debug: 'blueBright',
        info: 'greenBright',
        warn: 'yellowBright',
        error: 'redBright',
      },
      extensionColors: this.extensionColors,
    },
    async: true,
    asyncFunc: requestIdleCallback,
    enabled: __DEV__,
  })

  static #whereLogger(options: TLoggerHelperOptions) {
    if (__DEV__ && this.extensionColors[options.where] === undefined) {
      const number = NumberHelper.getRandomNumber(this.allColors.length)
      this.extensionColors[options.where] = this.allColors[number] ?? 'default'
    }

    return this.#logger.extend(
      `${StringHelper.capitalize(options.where)}:${StringHelper.capitalize(options.operation)}`
    )
  }

  static debug(log: unknown, options: TLoggerHelperOptions) {
    this.#whereLogger(options).debug(log)
  }

  static info(log: unknown, options: TLoggerHelperOptions) {
    this.#whereLogger(options).info(log)
  }

  static warn(log: unknown, options: TLoggerHelperOptions) {
    this.#whereLogger(options).warn(log)
  }

  static error(log: unknown, options: TLoggerHelperOptions) {
    this.#whereLogger(options).error(log)
  }

  static sentry(log: unknown, options: TLoggerHelperOptions) {
    this.#whereLogger(options).error(log)
    SentryHelper.capture(log, { where: options.where, operation: options.operation, level: 'error' })
  }
}
