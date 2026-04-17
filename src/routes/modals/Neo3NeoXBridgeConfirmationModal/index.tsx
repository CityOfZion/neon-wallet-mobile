import React, { useTransition } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainIconWithLabel } from '@/components/BlockchainIconWithLabel'
import { Details } from '@/components/Details'
import { TwButton } from '@/components/TwButton'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'
import TbCheck from '@/assets/images/tb-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const Neo3NeoXBridgeConfirmationModal = ({
  navigation,
  route: {
    params: {
      tokenToUse,
      tokenToReceive,
      accountToUse,
      addressToReceive,
      amountToUse,
      amountToReceive,
      bridgeFee,
      fromService,
      onSubmit,
    },
  },
}: TRootStackScreenProps<'Neo3NeoXBridgeConfirmationModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeConfirmation' })
  const { currency } = useCurrencySelector()

  const exchange = useExchange([
    { blockchain: tokenToUse.blockchain, tokens: [tokenToUse, fromService.feeToken] },
    { blockchain: tokenToReceive.blockchain, tokens: [tokenToReceive] },
  ])

  const [isSubmitting, startSubmitTransition] = useTransition()

  const handleSubmit = () => {
    if (isSubmitting) return

    startSubmitTransition(async () => {
      await onSubmit(navigation)
    })
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <Text className="mb-6 font-sans-medium text-base text-white">{t('description')}</Text>

        <Details.Root>
          <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('details')}</Details.Header>

          <Details.HeaderSeparator />

          <Details.Body>
            <Details.Item label={t('wantBridgeLabel')} contentClassName="justify-start">
              <BlockchainIconWithLabel token={tokenToUse} blockchain={tokenToUse.blockchain} />
              <TbArrowRight aria-hidden className="mt-0.5 size-5 text-orange" />
              <BlockchainIconWithLabel token={tokenToReceive} blockchain={tokenToReceive.blockchain} />
            </Details.Item>

            <Details.Panel label={t('bridgeFromLabel')}>
              <Details.Item label={t('sendingAddressLabel')}>{accountToUse.address}</Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={t('tokenLabel')}
                description={CurrencyHelper.format(
                  exchange.convertAmount(amountToUse, tokenToUse.hash, tokenToUse.blockchain),
                  { currency, showZero: false }
                )}
              >
                <BlockchainIconWithLabel token={tokenToUse} blockchain={tokenToUse.blockchain} />
                <Text className="font-sans-regular text-base text-white">{amountToUse}</Text>
              </Details.Item>
            </Details.Panel>

            <Details.Panel label={t('bridgeToLabel')}>
              <Details.Item label={t('receivingAddressLabel')}>{addressToReceive}</Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={t('tokenLabel')}
                description={CurrencyHelper.format(
                  exchange.convertAmount(amountToUse, tokenToUse.hash, tokenToUse.blockchain),
                  { currency, showZero: false }
                )}
              >
                <BlockchainIconWithLabel token={tokenToReceive} blockchain={tokenToReceive.blockchain} />
                <Text className="font-sans-regular text-base text-white">{amountToReceive}</Text>
              </Details.Item>
            </Details.Panel>
          </Details.Body>
        </Details.Root>

        <Details.Root className="mt-2">
          <Details.Body>
            <Details.Item
              label={t('totalFeeLabel')}
              description={CurrencyHelper.format(
                exchange.convertAmount(bridgeFee, fromService.feeToken.hash, fromService.name),
                { currency, showZero: false }
              )}
            >
              <BlockchainIconWithLabel token={fromService.feeToken} blockchain={fromService.name} />
              <Text className="font-sans-medium text-base text-white">{bridgeFee}</Text>
            </Details.Item>
          </Details.Body>
        </Details.Root>

        <View className="mt-auto py-4">
          <TwButton
            label={t('submitButtonLabel')}
            variant="contained-light"
            isLoading={isSubmitting}
            leftElement={<TbCheck aria-hidden className="text-green" />}
            onPress={handleSubmit}
          />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
