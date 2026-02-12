import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { SendDetails } from '@/components/SendDetails'
import { TwButton } from '@/components/TwButton'

import { usePressOnce } from '@/hooks/usePressOnce'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheck from '@/assets/images/tb-check.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SendConfirmModal = ({ navigation, route }: TRootStackScreenProps<'SendConfirmModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sendConfirmModal' })
  const { transactions, onConfirm, fee } = route.params

  const [isLoading, handleSubmit] = usePressOnce(async () => {
    await onConfirm(navigation)
  })

  return (
    <TwModalLayout title={t('title')} titleClassName="text-1xl" rightElement={<TwModalLayoutCloseIconButton />}>
      <Text className="mb-6 mt-1 text-left font-sans-regular text-base leading-5 text-white">{t('description')}</Text>

      <SendDetails transactions={transactions} fee={fee} />

      <View className="mt-auto">
        <TwButton
          label={t('confirmButtonLabel')}
          className="my-4"
          variant="contained-light"
          leftElement={<TbCheck aria-hidden />}
          onPress={handleSubmit}
          isLoading={isLoading}
        />
      </View>
    </TwModalLayout>
  )
}
