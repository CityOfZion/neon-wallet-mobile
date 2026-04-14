import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

type TProps = {
  error: Error
}

export const DappPermissionErrorContent = ({ error }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission.errorContent' })

  return (
    <View className="w-full items-center">
      <Text className="px-10 text-center font-sans-medium text-xl text-white">{t('subtitle')}</Text>

      <Text className="mt-4 font-sans-bold uppercase text-gray-300">{t('errorMessageLabel')}</Text>

      <Text className="w-full whitespace-pre-wrap break-words rounded bg-asphalt p-2 font-sans-medium text-white">
        {error.message}
      </Text>
    </View>
  )
}
