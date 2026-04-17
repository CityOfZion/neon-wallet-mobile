import React from 'react'

import { useTranslation } from 'react-i18next'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbEyeSearch from '@/assets/images/tb-eye-search.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'
import TbUsers from '@/assets/images/tb-users.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const QRCodeAddressContextModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'QRCodeAddressContextModal'>) => {
  const { address } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'qrCodeAddressContext' })

  const handlePressSend = () => {
    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'SendScreen',
      },
    })
  }

  const handlePressImport = async () => {
    navigation.replace('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'ImportScreen',
        params: { data: address },
      },
    })
  }

  const handlePressContact = async () => {
    const [serviceName] = BlockchainServiceHelper.bsAggregator.getBlockchainNameByAddress(address)
    if (!serviceName) return

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[serviceName]

    navigation.replace('PersistContactModal', {
      addresses: [
        {
          blockchain: service.name,
          address,
        },
      ],
    })
  }

  return (
    <ModalLayout.Root full={false}>
      <ModalLayout.Header />

      <ModalLayout.ViewContent>
        <TwMenuButton
          label={t('sendButtonLabel')}
          leftElement={<TbStepOut aria-hidden className="text-neon" />}
          onPress={handlePressSend}
        />

        <TwSeparator />

        <TwMenuButton
          onPress={handlePressImport}
          leftElement={<TbEyeSearch aria-hidden className="text-neon" />}
          label={t('watchButtonLabel')}
        />

        <TwSeparator />

        <TwMenuButton
          label={t('contactButtonLabel')}
          leftElement={<TbUsers aria-hidden className="text-neon" />}
          onPress={handlePressContact}
        />
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
