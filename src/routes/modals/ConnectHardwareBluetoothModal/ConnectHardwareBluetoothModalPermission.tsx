import { useTranslation } from 'react-i18next'
import { Linking, Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import MdClose from '@/assets/images/md-close.svg'
import MdLaunch from '@/assets/images/md-launch.svg'
import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'
import TbBluetooth from '@/assets/images/tb-bluetooth.svg'
import TbCheck from '@/assets/images/tb-check.svg'
import TbMapPin from '@/assets/images/tb-map-pin.svg'

type TProps = {
  bluetoothPermissionIsGranted?: boolean
  locationPermissionIsGranted?: boolean
}

export const ConnectHardwareBluetoothModalPermission = ({
  bluetoothPermissionIsGranted,
  locationPermissionIsGranted,
}: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareBluetoothModal.permissionsRequired' })
  return (
    <View className="w-full flex-grow items-center">
      <Text className="text-center font-sans-medium text-2xl text-white">{t('title')}</Text>

      <TbAlertTriangle aria-hidden className="my-9 h-28 w-28 stroke-1 text-blue" />

      <Text className="text-center font-sans-regular text-lg text-gray-100">{t('description')}</Text>

      <View className="mt-6 w-full">
        <TwMenuButton
          label={t('bluetoothLabel')}
          leftElement={<TbBluetooth aria-hidden />}
          rightElement={
            bluetoothPermissionIsGranted ? (
              <TbCheck aria-hidden className="text-green" />
            ) : (
              <MdClose aria-hidden className="text-pink" />
            )
          }
        />

        <TwSeparator />

        <TwMenuButton
          label={t('locationLabel')}
          leftElement={<TbMapPin aria-hidden />}
          rightElement={
            locationPermissionIsGranted ? (
              <TbCheck aria-hidden className="text-green" />
            ) : (
              <MdClose aria-hidden className="text-pink" />
            )
          }
        />
      </View>

      <TwButton
        className="mt-auto"
        variant="contained-light"
        label={t('openSettingsButtonLabel')}
        rightElement={<MdLaunch aria-hidden />}
        onPress={Linking.openSettings}
      />
    </View>
  )
}
