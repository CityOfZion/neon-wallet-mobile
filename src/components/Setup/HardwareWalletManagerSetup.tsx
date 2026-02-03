import { hasLedger } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import { AlertHelper } from '@/helpers/AlertHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useEditAccount } from '@/hooks/useAccountActions'
import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useMount } from '@/hooks/useMount'

const HardwareWalletManagerSetup = () => {
  const { t } = useTranslation('components', { keyPrefix: 'setup.hardwareWalletManager' })
  const { t: commonT } = useTranslation('common')
  const navigation = useNavigation()
  const { accountsRef } = useAccountsSelector()
  const { editAccount } = useEditAccount()

  useMount(() => {
    Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).forEach(service => {
      if (!hasLedger(service)) return

      service.ledgerService.emitter.on('getSignatureStart', () => {
        ToastHelper.loading({ message: t('requestingPermission'), id: 'hardware-signature' })
      })

      service.ledgerService.emitter.on('getSignatureEnd', () => {
        ToastHelper.dismiss('hardware-signature')
      })
    })

    const transformHardwareWalletAccountsToWatch = async () => {
      await Promise.allSettled(
        accountsRef.current
          .filter(account => account.type === 'hardware')
          .map(account => {
            editAccount({
              account,
              data: {
                type: 'watch',
              },
            })
          })
      )
    }

    HardwareWalletHelper.onHardwareWalletDisconnect = async () => {
      await transformHardwareWalletAccountsToWatch()
    }

    transformHardwareWalletAccountsToWatch()
  })

  useMount(() => {
    const removeOnHardwareWalletAttachedListener = HardwareWalletHelper.listenForUsbDeviceAttached(() => {
      const state = navigation.getState()
      const currentRoute = state ? state.routes[state.index] : undefined

      /*
          These screens and modals won't show the hardware wallet USB alert on top of them because it
          either doesn't make sense to show it or already has a connection component
        */
      if (currentRoute && (currentRoute.name === 'OnboardingScreen' || currentRoute.name.startsWith('ConnectHardware')))
        return

      AlertHelper.show({
        title: t('detectedHardwareByUsb'),
        buttons: [
          {
            label: commonT('general.yes'),
            onPress: () => {
              navigation.navigate('ConnectHardwareUsbModal')
            },
          },
          { label: commonT('general.no') },
        ],
      })
    })

    return () => {
      removeOnHardwareWalletAttachedListener()
    }
  })

  return null
}

export default HardwareWalletManagerSetup
