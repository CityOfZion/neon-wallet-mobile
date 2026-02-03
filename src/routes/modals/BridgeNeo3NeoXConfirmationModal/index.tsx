import React, { useTransition } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwSeparator } from '@/components/TwSeparator'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
import { NumberHelper } from '@/helpers/NumberHelper'

import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbArrowRight from '@/assets/images/tb-arrow-right.svg'
import TbCheck from '@/assets/images/tb-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

export const BridgeNeo3NeoXConfirmationModal = ({
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
}: TRootStackScreenProps<'BridgeNeo3NeoXConfirmationModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'bridgeNeo3NeoXConfirmationModal' })
  const { currency } = useCurrencySelector()

  const exchange = useExchange([
    { blockchain: tokenToUse.blockchain, tokens: [tokenToUse, fromService.feeToken] },
    { blockchain: tokenToReceive.blockchain, tokens: [tokenToReceive] },
  ])

  const [isSubmitting, startSubmitTransition] = useTransition()

  const getPrice = (amount: string, hash: string, blockchain: TBlockchainServiceKey) => {
    const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(hash, blockchain, exchange.data)

    if (convertedPrice === 0) return '--'

    return CurrencyHelper.format(NumberHelper.number(amount) * convertedPrice, { currency })
  }

  const handleSubmit = () => {
    if (isSubmitting) return

    startSubmitTransition(async () => {
      await onSubmit(navigation)
    })
  }

  return (
    <TwModalLayout title={t('title')} titleClassName="text-xl" rightElement={<TwModalLayoutCloseIconButton />}>
      <Text className="text-md mb-6 mt-1 text-left leading-5 text-white">{t('description')}</Text>

      <View className="mb-3 flex flex-col rounded bg-asphalt p-3">
        <View className="flex flex-row items-center gap-x-2 pb-3">
          <TbReceipt aria-hidden className="h-5 w-5 text-blue" />
          <Text className="text-md font-sans-medium text-white">{t('details')}</Text>
        </View>

        <TwSeparator />

        <TwDetailsCard.Content title={t('wantBridgeLabel')} className="py-4">
          <View className="flex flex-row items-center gap-x-3">
            <TwDetailsCard.BlockchainToken token={tokenToUse} blockchain={tokenToUse.blockchain} />

            <TbArrowRight aria-hidden className="mt-0.5 h-5 w-5 text-orange" />

            <TwDetailsCard.BlockchainToken token={tokenToReceive} blockchain={tokenToReceive.blockchain} />
          </View>
        </TwDetailsCard.Content>

        <TwDetailsCard.Step label={t('bridgeFromLabel')} />

        <TwDetailsCard.Content title={t('sendingAddressLabel')} className="py-4">
          <Text
            className="text-md w-full max-w-52 font-sans-regular text-white"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {accountToUse.address}
          </Text>
        </TwDetailsCard.Content>

        <TwSeparator />

        <TwDetailsCard.Content
          title={t('tokenLabel')}
          subtitle={getPrice(amountToUse, tokenToUse.hash, tokenToUse.blockchain)}
          className="py-4"
        >
          <View className="flex flex-row items-center justify-between gap-x-2">
            <TwDetailsCard.BlockchainToken token={tokenToUse} blockchain={tokenToUse.blockchain} />

            <Text className="text-md font-sans-regular text-white">{amountToUse}</Text>
          </View>
        </TwDetailsCard.Content>

        <TwDetailsCard.Step label={t('bridgeToLabel')} />

        <TwDetailsCard.Content title={t('receivingAddressLabel')} className="py-4">
          <Text
            className="text-md w-full max-w-52 font-sans-regular text-white"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {addressToReceive}
          </Text>
        </TwDetailsCard.Content>

        <TwSeparator />

        <TwDetailsCard.Content
          title={t('tokenLabel')}
          subtitle={getPrice(amountToReceive, tokenToReceive.hash, tokenToReceive.blockchain)}
          className="pb-1 pt-4"
        >
          <View className="flex flex-row items-center justify-between gap-x-2">
            <TwDetailsCard.BlockchainToken token={tokenToReceive} blockchain={tokenToReceive.blockchain} />

            <Text className="text-md font-sans-regular text-white">{amountToReceive}</Text>
          </View>
        </TwDetailsCard.Content>
      </View>

      <View className="flex flex-col gap-y-2 rounded bg-asphalt p-3">
        <View className="flex flex-row justify-between gap-x-2">
          <Text className="text-md font-sans-medium text-blue">{t('totalFeeLabel')}</Text>
          <Text className="font-sans-regular text-xs text-gray-100">
            {getPrice(bridgeFee, fromService.feeToken.hash, fromService.name)}
          </Text>
        </View>

        <View className="flex flex-row justify-between gap-x-2">
          <TwDetailsCard.BlockchainToken token={fromService.feeToken} blockchain={fromService.name} />

          <Text className="text-md font-sans-medium text-white">{bridgeFee}</Text>
        </View>
      </View>

      <TwButton
        label={t('submitButtonLabel')}
        variant="contained-light"
        className="mx-4 mb-12 mt-8"
        isLoading={isSubmitting}
        leftElement={<TbCheck aria-hidden className="text-green" />}
        onPress={handleSubmit}
      />
    </TwModalLayout>
  )
}
