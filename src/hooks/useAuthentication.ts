import { useCallback } from 'react'

import { useTranslation } from 'react-i18next'

import { AppError } from '@/helpers/ErrorHelper'

import { useDeviceAuthentication } from './useDeviceAuthentication'
import { useItemNfiAuthentication } from './useItemNfiAuthentication'
import { usePasswordAuthentication } from './usePasswordAuthentication'
import { useSecuritySelector } from './useSettingsSelector'

import type { TAccount, TSecurityType } from '@/types/store'

export const useAuthentication = () => {
  const { t: commonT } = useTranslation('common')
  const { securityRef } = useSecuritySelector()
  const { authenticateDevice } = useDeviceAuthentication()
  const { authenticatePassword } = usePasswordAuthentication()
  const { authenticateNfi } = useItemNfiAuthentication()

  const authenticate = useCallback(async (account?: TAccount) => {
    const authenticateFnBySecurityType: Record<TSecurityType, () => Promise<void>> = {
      device: authenticateDevice,
      password: authenticatePassword,
      nfi: authenticateNfi,
      disabled: async () => {
        // No authentication needed for disabled security
      },
    }

    try {
      if (account?.type === 'watch') throw new AppError(commonT('errors.watchAccountUnauthorized'))
      if (account?.type === 'hardware') return

      await authenticateFnBySecurityType[securityRef.current.type]()
    } catch (error) {
      throw AppError.wrap(error, commonT('errors.unauthorized'))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    authenticate,
  }
}
