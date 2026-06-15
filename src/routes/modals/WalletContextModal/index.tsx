import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'
import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'
import TbPlus from '@/assets/images/tb-plus.svg'
import TbReorder from '@/assets/images/tb-reorder.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const WalletContextModal = ({ navigation, route }: TRootStackScreenProps<'WalletContextModal'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'walletContext' })
  const { t: tCommon } = useTranslation('common')

  const { wallets } = useWalletsSelector()
  const { authenticate } = useAuthentication()

  const handlePressCreate = () => {
    navigation.replace('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'CreateWalletStep1Screen',
        initial: false,
      },
    })
  }

  const handlePressBackup = async () => {
    if (!wallet) return

    try {
      await authenticate()

      navigation.replace('TabStack', {
        screen: 'MoreStack',
        params: {
          screen: 'SettingsWalletBackupStep1Screen',
          params: { wallet },
          initial: false,
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'WalletContextModal', operation: 'handlePressBackup' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handlePressReorder = () => {
    navigation.replace('ReorderWalletsModal')
  }

  return (
    <ModalLayout.Root full={false}>
      <ModalLayout.Header />

      <ModalLayout.ViewContent>
        {wallet?.type === 'standard' && (
          <Fragment>
            <TwMenuButton
              label={t('backup')}
              subtitle={
                wallet.backupStatus !== 'successful' ? <TbAlertTriangle aria-hidden className="text-pink" /> : undefined
              }
              leftElement={<TbDeviceFloppy aria-hidden />}
              onPress={handlePressBackup}
            />

            <TwSeparator />
          </Fragment>
        )}

        <TwMenuButton label={t('create')} leftElement={<TbPlus aria-hidden />} onPress={handlePressCreate} />

        <TwSeparator />

        <TwMenuButton
          label={t('reorder')}
          leftElement={<TbReorder aria-hidden />}
          onPress={handlePressReorder}
          disabled={wallets.length === 0}
        />

        <TwButton variant="text" label={tCommon('general.cancel')} className="mt-7" onPress={navigation.goBack} />
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
