import { BSError } from '@cityofzion/blockchain-service'

import { I18nextHelper } from './I18nextHelper'

const { t, ...i18next } = I18nextHelper.get()

export class AppError extends Error {
  readonly fromAppError: boolean = false

  constructor(message: string, rootError?: unknown, fromAppError?: boolean) {
    super(message)
    this.name = 'AppError'
    this.fromAppError = fromAppError ?? false

    if (rootError && rootError instanceof Error && rootError.stack && !(rootError instanceof AppError)) {
      this.stack += `\nCaused by: ${rootError.stack}`
    }
  }

  static wrap(error: unknown, defaultMessage?: string | undefined | null) {
    if (error instanceof AppError) {
      const appError = new AppError(error.message, undefined, true)
      return appError
    }

    if (defaultMessage === null && error instanceof Error) {
      return new AppError(error.message, error, false)
    }

    return new AppError(defaultMessage ?? t('errors.unexpected'), error, false)
  }
}

export class WalletConnectError extends AppError {
  code: string

  constructor(message: string, code: string, rootError?: unknown, fromAppError?: boolean) {
    super(message, rootError, fromAppError)
    this.name = 'WalletConnectError'
    this.code = code
  }

  static wrap(error: unknown, defaultMessage?: string | undefined | null) {
    if (error instanceof WalletConnectError) {
      const walletConnectError = new WalletConnectError(error.message, error.code, undefined, true)
      return walletConnectError
    }

    if (error instanceof AppError) {
      return new WalletConnectError(error.message, 'UNEXPECTED_ERROR', undefined, true)
    }

    if (error instanceof BSError) {
      const hasTranslation = i18next.exists(`common:walletConnect.errorsByCode.${error.code}`)
      const message = hasTranslation
        ? t(`common:walletConnect.errorsByCode.${error.code}`, '')
        : (defaultMessage ?? t('walletConnect.errorsByCode.UNEXPECTED_ERROR'))
      const code = hasTranslation ? error.code : 'UNEXPECTED_ERROR'

      return new WalletConnectError(message, code, undefined, false)
    }

    if (defaultMessage === null && error instanceof Error) {
      return new WalletConnectError(error.message, 'UNEXPECTED_ERROR', error, false)
    }

    return new WalletConnectError(
      defaultMessage ?? t('walletConnect.errorsByCode.UNEXPECTED_ERROR'),
      'UNEXPECTED_ERROR',
      error,
      false
    )
  }
}

export class AbortError extends Error {
  constructor() {
    super('The operation was aborted.')
    this.name = 'Abort'
  }
}
