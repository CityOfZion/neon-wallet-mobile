import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'
import type { Device as BleDevice } from 'react-native-ble-plx'

import { Loader } from '@/components/Loader'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCreateHardwareWallet } from '@/hooks/useHardwareWallet'
import { useMount } from '@/hooks/useMount'

import TbBluetooth from '@/assets/images/tb-bluetooth.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

type TItem = {
  device: BleDevice
  isLoading: boolean
  onPress: () => void
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return <TwMenuButton label={item.device.name || ''} onPress={item.onPress} isLoading={item.isLoading} />
}

export const ConnectHardwareBluetoothModalList = ({
  navigation,
}: TRootStackScreenProps<'ConnectHardwareBluetoothModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareBluetoothModal.list' })
  const { t: commonT } = useTranslation('common')
  const { createHardwareWallet } = useCreateHardwareWallet()

  const [devices, setDevices] = useState<BleDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<BleDevice>()

  const handleConnect = async (device: BleDevice) => {
    try {
      setSelectedDevice(device)
      const connectedAccounts = await HardwareWalletHelper.connectByBluetooth(device)
      const { newWallets } = await createHardwareWallet(connectedAccounts)

      ToastHelper.success({ message: t('success') })

      navigation.pop(2)
      await UtilsHelper.sleep(500)
      navigation.navigate('TabStack', {
        screen: 'WalletsStack',
        params: {
          screen: 'WalletScreen',
          params: {
            wallet: newWallets[0],
          },
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'ConnectHardwareBluetoothModalList', operation: 'connect' })
      ToastHelper.error({
        message: AppError.wrap(error, commonT('hardwareWallet.errors.hardwareWalletNotFound')).message,
      })
      setSelectedDevice(undefined)
    }
  }

  const items = devices.map<TItem>(device => ({
    device,
    isLoading: selectedDevice?.id === device.id,
    onPress: handleConnect.bind(null, device),
  }))

  useMount(() => {
    const subscription = HardwareWalletHelper.listenForBluetoothDevice(devices => {
      setDevices(devices)
    })
    return () => {
      subscription.unsubscribe()
    }
  })

  return (
    <View className="flex-grow items-center">
      <Text className="text-center font-sans-medium text-2xl text-white">{t('title')}</Text>

      <TbBluetooth aria-hidden className="my-9 size-28 stroke-1 text-blue" />

      <FlatList
        className="flex-shrink flex-grow"
        data={items}
        renderItem={renderItem}
        ItemSeparatorComponent={TwSeparator}
        ListFooterComponent={<Loader className="size-10" />}
        showsVerticalScrollIndicator={false}
      />

      <Text className="mt-9 px-4 text-center font-sans-bold text-base text-gray-300">{t('description')}</Text>
    </View>
  )
}
