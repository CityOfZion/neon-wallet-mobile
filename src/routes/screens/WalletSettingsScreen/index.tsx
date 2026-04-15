import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AlertHelper } from '@/helpers/AlertHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useDeleteWallet } from '@/hooks/useWalletActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbFileExport from '@/assets/images/tb-file-export.svg'
import TbPencil from '@/assets/images/tb-pencil.svg'
import TbTrash from '@/assets/images/tb-trash.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'

export const WalletSettingsScreen = ({ navigation, route }: TWalletsStackScreenProps<'WalletSettingsScreen'>) => {
  const { wallet } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'walletSettings' })
  const { authenticate } = useAuthentication()
  const { deleteWallet } = useDeleteWallet()

  const handleDelete = async () => {
    navigation.pop(2)

    await deleteWallet(wallet)
  }

  const handlePressDelete = () => {
    AlertHelper.show({
      subtitle: t('deleteAlert'),
      buttons: [
        {
          label: t('navigation.cancel'),
        },
        {
          label: t('navigation.delete'),
          onPress: handleDelete,
        },
      ],
    })
  }

  const handlePressOnBackup = async () => {
    try {
      await authenticate()

      navigation.navigate('TabStack', {
        screen: 'MoreStack',
        params: {
          screen: 'SettingsWalletBackupStep1Screen',
          params: { wallet },
          initial: false,
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'WalletSettingsScreen', operation: 'handlePressOnBackup' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handlePressEdit = () => {
    navigation.navigate('EditWalletModal', {
      wallet,
    })
  }

  return (
    <TwScreenLayout title={t('title')}>
      <TwMenuButton label={t('customize')} leftElement={<TbPencil aria-hidden />} onPress={handlePressEdit} />

      {wallet.type === 'standard' && (
        <Fragment>
          <TwSeparator />

          <TwMenuButton label={t('backup')} leftElement={<TbFileExport aria-hidden />} onPress={handlePressOnBackup} />
        </Fragment>
      )}

      <View className="mt-auto items-center">
        <Text className="font-sans-bold text-sm uppercase text-gray-300">{t('deleteTitle')}</Text>

        <Text className="mb-4 text-center font-sans-regular text-white">{t('deleteSubtitle')}</Text>

        <TwButton
          variant="outline"
          label={t('deleteButton')}
          leftElement={<TbTrash aria-hidden />}
          onPress={handlePressDelete}
        />
      </View>
    </TwScreenLayout>
  )
}
