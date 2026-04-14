import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import TbBluetoothOff from '@/assets/images/tb-bluetooth-off.svg'

export const ConnectHardwareBluetoothModalBluetoothOff = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareBluetooth.bluetoothDisabled' })

  return (
    <View className="w-full flex-grow items-center">
      <Text className="text-center font-sans-medium text-2xl text-white">{t('title')}</Text>

      <TbBluetoothOff aria-hidden className="my-9 h-28 w-28 stroke-1 text-blue" />

      <Text className="text-center font-sans-regular text-lg text-gray-100">{t('description')}</Text>
    </View>
  )
}
