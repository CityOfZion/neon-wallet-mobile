import { Fragment, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { Loader } from '@/components/Loader'
import { TwButton } from '@/components/TwButton'

import { AbortError, AppError } from '@/helpers/ErrorHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCreateHardwareWallet } from '@/hooks/useHardwareWallet'
import { useMount } from '@/hooks/useMount'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbDeviceUsb from '@/assets/images/tb-device-usb.svg'
import TbX from '@/assets/images/tb-x.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

type TStatus = 'searching' | 'connected' | 'not-connected'

export const ConnectHardwareUsbModal = ({ navigation }: TRootStackScreenProps<'ConnectHardwareUsbModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareUsb' })
  const { t: commonT } = useTranslation('common')
  const { createHardwareWallet } = useCreateHardwareWallet()

  const [status, setStatus] = useState<TStatus>('searching')

  const abortControllerRef = useRef(new AbortController())

  const handleConnect = async () => {
    setStatus('searching')
    abortControllerRef.current = new AbortController()

    try {
      const connectedAccounts = await HardwareWalletHelper.connectByUsb({
        abortSignal: abortControllerRef.current.signal,
      })

      const { newWallets } = await createHardwareWallet(connectedAccounts)

      ToastHelper.success({
        message: t('success'),
      })

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
      if (error instanceof AbortError) return

      LoggerHelper.error(error, { where: 'ConnectHardwareUsbModal', operation: 'connect' })
      ToastHelper.error({
        message: AppError.wrap(error, commonT('hardwareWallet.errors.hardwareWalletNotFound')).message,
      })
      setStatus('not-connected')
    }
  }

  useMount(() => {
    handleConnect()

    return () => {
      abortControllerRef.current.abort()
    }
  })

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="items-center"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <Text className="font-sans-medium text-2xl text-white">{t('description1')}</Text>

      <TbDeviceUsb aria-hidden rotation={45} className="my-9 h-28 w-28 stroke-1 text-blue" />

      {match(status)
        .with('not-connected', () => (
          <Fragment>
            <View className="w-full flex-row items-center gap-4">
              <TbDeviceUsb aria-hidden className="text-neon" rotation={45} />

              <Text className="flex-grow font-sans-regular text-lg text-white">{t('noDevicesFound')}</Text>

              <TbX aria-hidden className="text-pink" />
            </View>

            <TwButton label={t('searchAgainButtonLabel')} onPress={handleConnect} variant="text" className="mt-auto" />

            <Text className="mt-7 text-center font-sans-regular text-lg text-gray-100">
              {t('noDevicesFoundDescription')}
            </Text>
          </Fragment>
        ))
        .otherwise(() => (
          <Fragment>
            <Text className="text-center font-sans-bold text-lg text-white">{t('description2')}</Text>

            <Text className="mt-2.5 text-center font-sans-regular text-lg text-gray-100">{t('description3')}</Text>

            <Loader containerClassName="mt-8" className="h-10 w-10" />
          </Fragment>
        ))}
    </TwModalLayout>
  )
}
