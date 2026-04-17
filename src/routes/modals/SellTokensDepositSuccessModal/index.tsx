import React from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Details } from '@/components/Details'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'

import { AccountHelper } from '@/helpers/AccountHelper'

import { useAccountsMapSelector } from '@/hooks/useAccountSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

export const SellTokensDepositSuccessModal = ({ route }: TRootStackScreenProps<'SellTokensDepositSuccessModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccess' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const { accountsMapRef } = useAccountsMapSelector()
  const { transaction } = route.params

  let token: TBSToken | undefined
  let amount: string | undefined
  let receiverAddress: string | undefined
  let receiverAccount: TAccount | undefined

  if (transaction.view === 'utxo') {
    const output = transaction.outputs.at(-1)
    token = output?.token
    amount = output?.amount
    receiverAddress = output?.address
    receiverAccount = output?.address
      ? accountsMapRef.current.get(
          AccountHelper.buildAccountKey({ address: output.address, blockchain: transaction.blockchain })
        )
      : undefined
  } else {
    const event = transaction.events.at(-1)
    token = event?.eventType === 'token' ? event.token : undefined
    amount = event?.amount
    receiverAddress = event?.to
    receiverAccount = event?.to
      ? accountsMapRef.current.get(
          AccountHelper.buildAccountKey({ address: event.to, blockchain: transaction.blockchain })
        )
      : undefined
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="pt-4">
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

          <Details.Panel label={t('transactionLabel')} labelClassName="mt-4 bg-gray-700/60 px-2 font-sans-medium">
            <Details.Item
              label={t('recipientLabel')}
              labelClassName="font-sans-medium text-xs"
              className="flex-col gap-y-2 py-1"
              contentClassName="gap-x-3"
              textToCopy={receiverAddress}
            >
              <Text className="flex-shrink flex-grow font-sans-regular text-sm text-white">
                {receiverAccount?.name ? `${receiverAccount.name} (${receiverAccount.address})` : receiverAddress}
              </Text>
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item
              label={t('amountLabel')}
              labelClassName="font-sans-medium text-xs"
              className="flex-col gap-y-2 py-1"
              contentClassName="justify-start w-full"
            >
              <TwBlockchainIcon blockchain={transaction.blockchain} className="size-3 text-gray-300" />

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
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
