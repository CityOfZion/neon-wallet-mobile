import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { match, P } from 'ts-pattern'

import { Details } from '@/components/Details'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TUseTransactionsTransactionEvent, TUseTransactionsTransactionInputOutput } from '@/types/store'

export const SellTokensDepositSuccessModal = ({ route }: TRootStackScreenProps<'SellTokensDepositSuccessModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccessModal' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  const { transaction } = route.params
  const isUtxo = transaction.view === 'utxo'
  const output = isUtxo ? (transaction.outputs.at(-1) as TUseTransactionsTransactionInputOutput) : undefined
  const event = !isUtxo ? (transaction.events.at(-1) as TUseTransactionsTransactionEvent) : undefined
  const amount = isUtxo ? output!.amount : event!.amount
  const receiverAccount = isUtxo ? output?.account : event?.toAccount
  const receiverName = receiverAccount?.name
  const receiverAddress = receiverAccount?.address

  const token = match({ output, event })
    .with({ output: P.nonNullable }, ({ output }) => output.token)
    .with({ event: P.when(value => value?.eventType === 'token') }, ({ event }) => event.token)
    .otherwise(() => undefined)

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="pt-4"
      titleClassName="text-white"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <PiSealCheck aria-hidden className="mx-auto size-24 text-blue" />

      <Text className="mx-12 mt-4 text-center font-sans-medium text-xl text-white">{t('subtitle')}</Text>

      <Details.Root className="mt-6 gap-3">
        <Details.Header
          className="mb-1 gap-x-2"
          labelClassName="font-sans-regular text-sm"
          leftElement={<TbReceipt aria-hidden className="size-5" />}
        >
          {t('detailsLabel')}
        </Details.Header>

        <Details.HeaderSeparator />

        <Details.Panel
          label={t('transactionLabel')}
          labelClassName="bg-gray-700/60 mt-4 bg-gray-700/60 px-2 font-sans-medium"
        >
          <Details.Item
            label={t('recipientLabel')}
            labelClassName="font-sans-medium text-xs"
            className="flex-col gap-y-2 py-1"
            contentClassName="gap-x-3"
            textToCopy={receiverAddress}
          >
            <Text className="flex-shrink flex-grow font-sans-regular text-sm text-white">
              {receiverName ? `${receiverName} (${receiverAddress})` : receiverAddress}
            </Text>
          </Details.Item>

          <Details.ItemSeparator />

          <Details.Item
            label={t('amountLabel')}
            labelClassName="font-sans-medium text-xs"
            className="flex-col gap-y-2 py-1"
            contentClassName="justify-start w-full"
          >
            <TwBlockchainIcon blockchain={transaction.blockchain} type="gray" className="size-3" />

            <Text
              className="flex-shrink flex-grow font-sans-regular text-sm text-white"
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {token?.symbol}{' '}
              <Text className="font-sans-regular text-sm uppercase text-gray-100">
                | {tCommonBlockchainServices(`${transaction.blockchain}.label`)}
              </Text>
            </Text>

            <Text className="max-w-[50%] font-sans-regular text-sm text-white" numberOfLines={1}>
              {amount}
            </Text>
          </Details.Item>

          <Details.ItemSeparator />

          <Details.Item
            label={t('transactionHashLabel')}
            labelClassName="font-sans-medium text-xs"
            className="flex-col gap-y-2 py-1"
            contentClassName="gap-x-3"
            textToCopy={transaction.txId}
          >
            <Text className="flex-shrink flex-grow break-all font-sans-regular text-sm text-white">
              {transaction.txId}
            </Text>
          </Details.Item>
        </Details.Panel>
      </Details.Root>
    </TwModalLayout>
  )
}
