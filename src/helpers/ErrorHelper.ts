import { BSError } from '@cityofzion/blockchain-service'

import { I18nextHelper } from './I18nextHelper'

const { t, ...i18next } = I18nextHelper.get()

export class AppError extends Error {
  readonly fromAppError: boolean = false

  constructor(message: string, rootError?: unknown, fromAppError?: boolean) {
    super(message)
    this.name = 'AppError'
    this.fromAppError = fromAppError || false

    if (rootError && rootError instanceof Error && rootError.stack && !(rootError instanceof AppError)) {
      this.stack += `\nCaused by: ${rootError.stack}`
    }
  }

  static wrap(error: unknown, defaultMessage?: string | undefined | null) {
    if (error instanceof AppError) {
      return new AppError(error.message, undefined, true)
    }

    if (defaultMessage === null && error instanceof Error) {
      return new AppError(error.message, error, false)
    }

    return new AppError(defaultMessage || t('errors.unexpected'), error, false)
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
      return new WalletConnectError(error.message, error.code, undefined, true)
    }

    if (error instanceof AppError) {
      return new WalletConnectError(error.message, 'UNEXPECTED_ERROR', undefined, true)
    }

    if (error instanceof BSError) {
      const hasTranslation = i18next.exists(`common:walletConnect.errorsByCode.${error.code}`)
      const message = hasTranslation
        ? t(`common:walletConnect.errorsByCode.${error.code}`, '')
        : defaultMessage || t('walletConnect.errorsByCode.UNEXPECTED_ERROR')
      const code = hasTranslation ? error.code : 'UNEXPECTED_ERROR'

      return new WalletConnectError(message, code, undefined, false)
    }

    if (defaultMessage === null && error instanceof Error) {
      return new WalletConnectError(error.message, 'UNEXPECTED_ERROR', error, false)
    }

    return new WalletConnectError(
      defaultMessage || t('walletConnect.errorsByCode.UNEXPECTED_ERROR'),
      'UNEXPECTED_ERROR',
      error,
      false
    )
  }

  /**
   * Builds the error response sent to the dApp. It is always in English, regardless of the wallet language,
   * because it is consumed by the dApp developer (logs, error trackers), not by the wallet user.
   * A JSON-RPC error response (e.g. from `getSdkError`) is returned as is.
   */
  static toDappError(error: unknown): { code: number; message: string } {
    if (WalletConnectError.#isErrorResponse(error)) return error

    return { code: -32000, message: WalletConnectError.#getDappMessage(error) }
  }

  static #isErrorResponse(error: unknown): error is { code: number; message: string } {
    if (typeof error !== 'object' || error === null || error instanceof Error) return false

    const { code, message } = error as Record<string, unknown>
    return typeof code === 'number' && typeof message === 'string'
  }

  static #getDappMessage(error: unknown): string {
    const translateToEnglish = (code: string) => t(`common:walletConnect.errorsByCode.${code}`, '', { lng: 'en' })

    if (error instanceof BSError) {
      return i18next.exists(`common:walletConnect.errorsByCode.${error.code}`)
        ? translateToEnglish(error.code)
        : error.message
    }

    if (error instanceof WalletConnectError) return translateToEnglish(error.code)

    // AppError messages are translated to the wallet language when thrown, so the English original is not available
    if (error instanceof AppError) return translateToEnglish('UNEXPECTED_ERROR')

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message)
        if (parsed?.name === 'AppError') return translateToEnglish('UNEXPECTED_ERROR')
      } catch {
        // Empty
      }

      if (error.message) return error.message
    }

    return translateToEnglish('UNEXPECTED_ERROR')
  }
}

export class AbortError extends Error {
  constructor() {
    super('The operation was aborted.')
    this.name = 'Abort'
  }
}
