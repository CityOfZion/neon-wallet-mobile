import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwIconButton } from '@/components/TwIconButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useBalance } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
}

export const AccountAccordionItem = ({ account }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'buyAndSellTokensAccounts' })
  const { isLoading, data } = useBalance(account)
  const { currency } = useCurrencySelector()

  const { address } = account

  return (
    <View className="my-2 flex flex-row items-center gap-x-3 gap-y-1.5">
      <TwBlockchainIcon blockchain={account.blockchain} className="mt-1 size-4.5 self-start text-gray-300" />

      <View className="flex flex-shrink flex-grow flex-col">
        <Text className="max-w-[80%] font-sans-medium text-lg text-white" numberOfLines={1}>
          {account.name}
        </Text>

        <View className="mt-1 flex flex-row items-center gap-1.5">
          <Text
            className="w-full max-w-[64%] font-sans-regular text-base text-gray-100"
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {address}
          </Text>

          <TwIconButton
            aria-label={t('labels.copyAddress')}
            size="md"
            className="p-0"
            icon={<TbCopy aria-hidden className="text-neon" />}
            onPress={() => ClipboardHelper.write(address, t('messages.addressCopied'))}
          />
        </View>
      </View>

      <Skeleton.Root loading={isLoading} className="h-6 w-16">
        <Skeleton.Group>
          <Skeleton.Item />
        </Skeleton.Group>

        <Skeleton.Content>
          <Text className="font-sans-regular text-lg text-white" numberOfLines={1}>
            {CurrencyHelper.format(data?.exchangeTotal || 0, { currency })}
          </Text>
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
