import { Trans, useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useItemNfiAuthentication } from '@/hooks/useItemNfiAuthentication'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

export const RemoveNfiModal = ({ route, navigation }: TRootStackScreenProps<'RemoveNfiModal'>) => {
  const { onSuccess, onError } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'removeNfiModal' })
  const { removeNfiByNfi, removeNfiByPassword } = useItemNfiAuthentication()

  const handleClose = () => {
    navigation.goBack()
    onError?.()
  }

  const handleNfIPress = async () => {
    try {
      await removeNfiByNfi()
      navigation.goBack()
      UtilsHelper.sleep(500)
      onSuccess()
    } catch (error) {
      navigation.goBack()
      onError?.(error as Error)
    }
  }

  const handleNoNfiPress = async () => {
    try {
      await removeNfiByPassword()
      navigation.goBack()
      UtilsHelper.sleep(500)
      onSuccess()
    } catch (error) {
      navigation.goBack()
      onError?.(error as Error)
    }
  }

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton onPress={handleClose} />}
      onRequestClose={handleClose}
    >
      <Text className="font-sans-regular text-lg text-white">{t('description')}</Text>

      <TwMenuButton
        className="mt-7"
        onPress={handleNfIPress}
        label={
          <Text numberOfLines={1} className="flex-shrink font-sans-regular text-lg text-neon">
            <Trans t={t} i18nKey="haveNfiLabelButton">
              start
              <Text className="uppercase">middle</Text>
              end
            </Trans>
          </Text>
        }
      />

      <TwSeparator />

      <TwMenuButton
        onPress={handleNoNfiPress}
        label={
          <Text numberOfLines={1} className="flex-shrink font-sans-regular text-lg text-neon">
            <Trans t={t} i18nKey="noNfiLabelButton">
              start
              <Text className="uppercase">middle</Text>
              end
            </Trans>
          </Text>
        }
      />
    </TwModalLayout>
  )
}
