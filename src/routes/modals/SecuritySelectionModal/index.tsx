import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ScreenLoader } from '@/components/ScreenLoader'
import { TwBanner } from '@/components/TwBanner'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useDeviceAuthentication } from '@/hooks/useDeviceAuthentication'
import { useItemNfiAuthentication } from '@/hooks/useItemNfiAuthentication'
import { useMount } from '@/hooks/useMount'
import { usePasswordAuthentication } from '@/hooks/usePasswordAuthentication'
import { useSecuritySelector } from '@/hooks/useSettingsSelector'
import { useStandardWalletsSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { SecuritySelectionModalButton } from './SecuritySelectionModalButton'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TSecurityType } from '@/types/store'

export const SecuritySelectionModal = ({ navigation }: TRootStackScreenProps<'SecuritySelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'securitySelectionModal' })
  const { security } = useSecuritySelector()
  const { walletsRef } = useStandardWalletsSelector()
  const { linkNfi, isNfiAuthenticationAvailable, removeNfi } = useItemNfiAuthentication()
  const { linkDevice, isDeviceAuthenticationAvailable, removeDevice } = useDeviceAuthentication()
  const { linkPassword, removePassword } = usePasswordAuthentication()

  const [loading, setLoading] = useState(false)

  const removeFnBySecurityType: Record<TSecurityType, () => Promise<void>> = {
    password: removePassword,
    device: removeDevice,
    nfi: removeNfi,
    disabled: async () => {
      // No action needed for disabled security type
    },
  }

  const linkFnBySecurityType: Record<TSecurityType, () => Promise<void>> = {
    password: linkPassword,
    device: linkDevice,
    nfi: linkNfi,
    disabled: async () => {
      // No action needed for disabled security type
    },
  }

  const handleLinkSecurity = (type: TSecurityType) => {
    return async () => {
      try {
        if (security.type === type) {
          return
        }

        setLoading(true)

        await removeFnBySecurityType[security.type]()

        await linkFnBySecurityType[type]()
      } catch (error) {
        LoggerHelper.error(error, { where: 'SecuritySelectionModal', operation: 'handleLinkSecurity' })
        ToastHelper.error({ message: AppError.wrap(error).message })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRemoveSecurity = async () => {
    try {
      setLoading(true)
      await removeFnBySecurityType[security.type]()
    } catch (error) {
      LoggerHelper.error(error, { where: 'SecuritySelectionModal', operation: 'handleRemoveSecurity' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    } finally {
      setLoading(false)
    }
  }

  const { isMounting } = useMount(
    () => {
      const hasNoBackupWallet = walletsRef.current.some(wallet => wallet.backupStatus !== 'successful')

      if (hasNoBackupWallet) {
        navigation.replace('TabStack', {
          screen: 'MoreStack',
          params: {
            screen: 'SettingsSecurityBackupScreen',
          },
        })
      }
    },
    [navigation, walletsRef],
    1000
  )

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} contentContainerClassName="px-0">
      {isMounting || isNfiAuthenticationAvailable === undefined || isDeviceAuthenticationAvailable === undefined ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <Text className="mb-6 px-5 font-sans-regular text-lg text-white">{t('description')}</Text>

          <View className="px-5">
            <SecuritySelectionModalButton
              currentSecurity={security}
              securityType="password"
              disabled={loading}
              onPress={handleLinkSecurity('password')}
              onRemove={handleRemoveSecurity}
              label={t('passwordTypeButtonLabel')}
            />

            {isDeviceAuthenticationAvailable && (
              <Fragment>
                <TwSeparator />

                <SecuritySelectionModalButton
                  currentSecurity={security}
                  securityType="device"
                  disabled={loading}
                  onPress={handleLinkSecurity('device')}
                  onRemove={handleRemoveSecurity}
                  label={t('deviceTypeButtonLabel')}
                />
              </Fragment>
            )}

            {isNfiAuthenticationAvailable && (
              <Fragment>
                <TwSeparator />

                <SecuritySelectionModalButton
                  currentSecurity={security}
                  securityType="nfi"
                  disabled={loading}
                  onPress={handleLinkSecurity('nfi')}
                  onRemove={handleRemoveSecurity}
                  label={t('nfiTypeButtonLabel')}
                />
              </Fragment>
            )}
          </View>

          {security.type === 'disabled' && (
            <View className="mt-auto px-5">
              <TwBanner type="error">{t('alert')}</TwBanner>
            </View>
          )}
        </Fragment>
      )}
    </TwModalLayout>
  )
}
