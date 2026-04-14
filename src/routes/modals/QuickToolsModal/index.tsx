import { Fragment } from 'react'

import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { HardwareWalletHelper } from '@/helpers/HardwareWalletHelper'
import { QrCodeScanModalHelper } from '@/helpers/QrCodeScanModalHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useHasHardwareAccountSelector } from '@/hooks/useAccountSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbChartBarPopular from '@/assets/images/tb-chart-bar-popular.svg'
import TbDeviceUsb from '@/assets/images/tb-device-usb.svg'
import TbQrcode from '@/assets/images/tb-qrcode.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'
import TbShoppingBag from '@/assets/images/tb-shopping-bag.svg'
import TbStepInto from '@/assets/images/tb-step-into.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'
import TbTransform from '@/assets/images/tb-transform.svg'
import TbX from '@/assets/images/tb-x.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

const isIos = Platform.OS === 'ios'

export const QuickToolsModal = ({ navigation }: TRootStackScreenProps<'QuickToolsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'quickTools' })
  const { hasHardwareAccount } = useHasHardwareAccountSelector()

  const handlePressQrCode = async () => {
    navigation.goBack()
    await UtilsHelper.sleep(500)
    QrCodeScanModalHelper.show({
      onScan(data) {
        if (WalletKitHelper.isValidURI(data)) {
          navigation.navigate('DappConnectionModal', {
            uri: data,
          })
          return
        }

        if (BlockchainServiceHelper.bsAggregator.validateAddressAllBlockchains(data)) {
          navigation.navigate('QRCodeAddressContextModal', {
            address: data,
          })
          return
        }

        if (
          BSKeychainHelper.isValidMnemonic(data) ||
          BlockchainServiceHelper.bsAggregator.validateEncryptedAllBlockchains(data) ||
          BlockchainServiceHelper.bsAggregator.validateKeyAllBlockchains(data)
        ) {
          navigation.navigate('TabStack', {
            screen: 'MoreStack',
            params: {
              screen: 'ImportScreen',
              params: { data },
            },
          })
        }
      },
    })
  }

  const handlePressSend = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: {
          screen: 'SendScreen',
        },
      },
      { pop: true }
    )
  }

  const handlePressReceive = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: {
          screen: 'ReceiveScreen',
        },
      },
      { pop: true }
    )
  }

  const handlePressSwap = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: {
          screen: 'SwapScreen',
        },
      },
      { pop: true }
    )
  }

  const handlePressConnectHardware = () => {
    navigation.replace('ConnectHardwareTypeSelectionModal')
  }

  const handlePressBuyAndSellTokens = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: { screen: 'BuyAndSellTokensScreen', params: { account: undefined } },
      },
      { pop: true }
    )
  }

  const handlePressNeo3NeoXBridge = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: { screen: 'Neo3NeoXBridgeScreen', params: { account: undefined } },
      },
      { pop: true }
    )
  }

  const handlePressNeo3Vote = () => {
    navigation.navigate(
      'TabStack',
      {
        screen: 'WalletsStack',
        params: { screen: 'Neo3VoteScreen', params: { defaultNeo3Account: undefined } },
      },
      { pop: true }
    )
  }

  const handlePressDisconnectHardware = () => {
    HardwareWalletHelper.disconnect()
  }

  return (
    <TwModalLayout withoutHeader full={false}>
      <TwMenuButton
        label={t('qrCode.title')}
        leftElement={<TbQrcode aria-hidden className="text-neon" />}
        onPress={handlePressQrCode}
      />

      <TwSeparator />

      {!isIos && (
        <Fragment>
          <TwMenuButton
            label={t('buyAndSellTokens.title')}
            leftElement={<TbShoppingBag aria-hidden />}
            onPress={handlePressBuyAndSellTokens}
          />

          <TwSeparator />
        </Fragment>
      )}

      <TwMenuButton
        label={t('send.title')}
        leftElement={<TbStepOut aria-hidden className="text-neon" />}
        onPress={handlePressSend}
      />

      <TwSeparator />

      <TwMenuButton
        label={t('receive.title')}
        leftElement={<TbStepInto aria-hidden className="text-neon" />}
        onPress={handlePressReceive}
      />

      {!isIos && (
        <Fragment>
          <TwSeparator />

          <TwMenuButton label={t('swap.title')} leftElement={<TbTransform aria-hidden />} onPress={handlePressSwap} />
        </Fragment>
      )}

      <TwSeparator />

      <TwMenuButton
        label={t('neo3NeoXBridge.title')}
        leftElement={<TbReplace2 aria-hidden />}
        onPress={handlePressNeo3NeoXBridge}
      />

      <TwSeparator />

      <TwMenuButton
        label={t('neo3Vote.title')}
        leftElement={<TbChartBarPopular aria-hidden />}
        onPress={handlePressNeo3Vote}
      />

      <TwSeparator />

      <TwMenuButton
        label={hasHardwareAccount ? t('hardware.disconnectTitle') : t('hardware.connectTitle')}
        leftElement={
          hasHardwareAccount ? <TbX aria-hidden className="text-pink" /> : <TbDeviceUsb aria-hidden rotation={45} />
        }
        onPress={hasHardwareAccount ? handlePressDisconnectHardware : handlePressConnectHardware}
      />
    </TwModalLayout>
  )
}
