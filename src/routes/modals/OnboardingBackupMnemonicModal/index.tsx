import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useExportMnemonic } from '@/hooks/useExportMnemonic'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingBackupMnemonicModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'OnboardingBackupMnemonicModal'>) => {
  const { saveMnemonicToTextFile } = useExportMnemonic()
  const { t } = useTranslation('modals', { keyPrefix: 'onboardingBackupMnemonicModal' })
  const dispatch = useAppDispatch()
  const [isSubmitting, startSubmitting] = usePressOnce(async () => {
    try {
      const mnemonic = await SecureStoreHelper.getMnemonic(wallet)
      await saveMnemonicToTextFile(mnemonic!)

      dispatch(walletReducerActions.saveWallet({ ...wallet, backupStatus: 'successful' }))

      navigation.replace('TabStack', {
        screen: 'WalletsStack',
        params: {
          screen: 'WalletsScreen',
        },
      })
    } catch (error) {
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  })

  const { wallet } = route.params

  return (
    <TwModalLayout title={t('title')} contentContainerClassName="flex-col flex-1 gap-y-6">
      <Text className="font-sans-medium text-base text-white">{t('description')}</Text>

      <TwBanner type="warning" textClassName="text-base">
        {t('warningLabel')}
      </TwBanner>

      <View className="mb-4 mt-auto flex-col gap-7">
        <TwSeparator />

        <TwButton
          variant="contained-light"
          label={t('backupAndContinueButtonLabel')}
          leftElement={<TbDeviceFloppy aria-hidden />}
          onPress={startSubmitting}
          isLoading={isSubmitting}
        />
      </View>
    </TwModalLayout>
  )
}
