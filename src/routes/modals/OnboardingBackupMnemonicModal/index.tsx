import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'

import { AppError } from '@/helpers/ErrorHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useExportMnemonic } from '@/hooks/useExportMnemonic'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import NeonWalletIcon from '@/assets/images/neon-wallet-icon.svg'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TRootStackScreenProps } from '@/types/stacks'

export const OnboardingBackupMnemonicModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'OnboardingBackupMnemonicModal'>) => {
  const { wallet, onSuccess } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'onboardingBackupMnemonic' })
  const dispatch = useAppDispatch()
  const { saveMnemonicToTextFile } = useExportMnemonic()

  const [isSubmitting, startSubmitting] = usePressOnce(async () => {
    try {
      const mnemonic = await SecureStoreHelper.getMnemonic(wallet)
      await saveMnemonicToTextFile(mnemonic!)

      dispatch(walletReducerActions.saveWallet({ ...wallet, backupStatus: 'successful' }))

      navigation.goBack()

      await UtilsHelper.sleep(500)

      onSuccess()
    } catch (error) {
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  })

  return (
    <TwModalLayout title={t('title')} contentContainerClassName="flex-col flex-1 gap-y-6">
      <View className="mt-8 flex-col items-center gap-y-6">
        <NeonWalletIcon aria-hidden className="size-20 text-neon" />
        <Text className="font-sans-regular text-2xl text-neon">{t('subtitle')}</Text>

        <Text className="text-center font-sans-medium text-base text-white">
          <Trans t={t} i18nKey="description">
            start
            <Text className="italic">middle</Text>
            end
          </Trans>
        </Text>
      </View>

      <View className="mb-4 mt-auto flex-col gap-7">
        <TwBanner type="warning" textClassName="text-base">
          {t('warningLabel')}
        </TwBanner>

        <TwButton
          variant="contained-light"
          label={t('backupAndContinueButtonLabel')}
          onPress={startSubmitting}
          isLoading={isSubmitting}
        />
      </View>
    </TwModalLayout>
  )
}
