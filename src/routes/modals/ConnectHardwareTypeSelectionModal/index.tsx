import { useTranslation } from 'react-i18next'
import { Platform, Text, View } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbBluetooth from '@/assets/images/tb-bluetooth.svg'
import TbDeviceUsb from '@/assets/images/tb-device-usb.svg'
import TbHelp from '@/assets/images/tb-help.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ConnectHardwareTypeSelectionModal = ({
  navigation,
}: TRootStackScreenProps<'ConnectHardwareTypeSelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareTypeSelection' })

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="items-center">
        <Text className="font-sans-medium text-2xl text-white">{t('description')}</Text>

        <TbHelp aria-hidden className="my-9 size-28 stroke-1 text-blue" />

        <View className="gap-2.5">
          <TwMenuButton
            variant="contained"
            label={t('bluetoothLabel')}
            leftElement={<TbBluetooth aria-hidden />}
            onPress={() => navigation.navigate('ConnectHardwareBluetoothModal')}
          />

          <TwMenuButton
            disabled={Platform.OS === 'ios'}
            variant="contained"
            label={t('usbLabel')}
            leftElement={<TbDeviceUsb aria-hidden rotation={45} />}
            onPress={() => navigation.navigate('ConnectHardwareUsbModal')}
          />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
