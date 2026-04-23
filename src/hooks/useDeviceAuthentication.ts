import { useEffect, useState } from 'react'

import * as LocalAuthentication from 'expo-local-authentication'
import { useTranslation } from 'react-i18next'

import { AppError } from '@/helpers/ErrorHelper'

import { useAppDispatch } from './useRedux'

import { settingsReducerActions } from '@/store/reducers/settings'

export const useDeviceAuthentication = () => {
  const { t: tCommon } = useTranslation('common')
  const dispatch = useAppDispatch()
  const [isDeviceAuthenticationAvailable, setIsDeviceAuthenticationAvailable] = useState<boolean>()

  const checkDeviceAuthenticationAvailable = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()
    if (!canUseHardware) return false

    return true
  }

  const linkDevice = async () => {
    const isAvailable = checkDeviceAuthenticationAvailable()
    if (!isAvailable) return

    const result = await LocalAuthentication.authenticateAsync({
      requireConfirmation: true,
    })

    if (!result.success) return

    dispatch(settingsReducerActions.setSecurity({ type: 'device' }))
  }

  const removeDevice = async () => {
    await authenticateDevice()
    dispatch(settingsReducerActions.setSecurity({ type: 'disabled' }))
  }

  const authenticateDevice = async () => {
    const isAvailable = await checkDeviceAuthenticationAvailable()
    if (!isAvailable) throw new AppError(tCommon('errors.unauthorized'))

    const result = await LocalAuthentication.authenticateAsync()

    if (!result.success) {
      throw new AppError(tCommon('errors.unauthorized'))
    }
  }

  useEffect(() => {
    checkDeviceAuthenticationAvailable().then(setIsDeviceAuthenticationAvailable)
  }, [])

  return {
    authenticateDevice,
    linkDevice,
    isDeviceAuthenticationAvailable,
    removeDevice,
  }
}
