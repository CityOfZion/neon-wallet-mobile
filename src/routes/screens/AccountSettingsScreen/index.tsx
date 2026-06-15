import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AlertHelper } from '@/helpers/AlertHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useDeleteAccount } from '@/hooks/useAccountActions'
import { useAccountByIdSelector } from '@/hooks/useAccountSelector'
import { useAuthentication } from '@/hooks/useAuthentication'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbPencil from '@/assets/images/tb-pencil.svg'
import TbTrash from '@/assets/images/tb-trash.svg'
import TbUpload from '@/assets/images/tb-upload.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'

export const AccountSettingsScreen = ({ navigation, route }: TWalletsStackScreenProps<'AccountSettingsScreen'>) => {
  const { account } = useAccountByIdSelector(route.params.account.id)
  const { authenticate } = useAuthentication()
  const { t } = useTranslation('screens', { keyPrefix: 'accountSettings' })
  const { deleteAccount } = useDeleteAccount()

  const handleDelete = async () => {
    navigation.pop(2)

    await deleteAccount(account)
  }

  const handlePressDelete = async () => {
    AlertHelper.show({
      subtitle: t('deleteAlert'),
      buttons: [{ label: t('navigation.cancel') }, { label: t('navigation.delete'), onPress: handleDelete }],
    })
  }

  const handlePressExportKey = async () => {
    try {
      await authenticate()

      navigation.navigate('ExportKeyModal', {
        account,
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'AccountSettingsScreen', operation: 'handlePressExportKey' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handlePressCustomize = () => {
    navigation.navigate('EditAccountModal', {
      account,
    })
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <TwMenuButton label={t('customize')} leftElement={<TbPencil aria-hidden />} onPress={handlePressCustomize} />

        {account.type === 'standard' && (
          <Fragment>
            <TwSeparator />

            <TwMenuButton
              label={t('exportKey')}
              leftElement={<TbUpload aria-hidden />}
              onPress={handlePressExportKey}
            />
          </Fragment>
        )}

        <View className="mb-2 mt-auto items-center">
          <Text className="font-sans-bold text-sm uppercase text-gray-300">{t('deleteTitle')}</Text>

          <Text className="mb-4 text-center font-sans-regular text-white">{t('deleteSubtitle')}</Text>

          <TwButton
            variant="outline"
            label={t('deleteButton')}
            leftElement={<TbTrash aria-hidden />}
            onPress={handlePressDelete}
          />
        </View>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
