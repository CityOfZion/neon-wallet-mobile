import type { TBSToken } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useContactsSelector } from '@/hooks/useContactSelector'

import TbReceipt from '@/assets/images/tb-receipt.svg'
import TbUsers from '@/assets/images/tb-users.svg'

import { Details } from './Details'
import { TwBlockchainIcon } from './TwBlockchainIcon'
import { TwButton } from './TwButton'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TSendDetailsDataItem = {
  address: string
  amount: string
  token?: TBSToken
}

export type TSendDetailsData = {
  txId?: string
  items: TSendDetailsDataItem[]
}

type TSendDetailsItemProps = {
  txId?: string
  address: string
  amount: string
  token?: TBSToken
  blockchain: TBlockchainServiceKey
  order: number
}

type TProps = {
  data: TSendDetailsData[]
  blockchain: TBlockchainServiceKey
  fee?: string
}

const SendDetailsItem = ({ txId, address, amount, token, blockchain, order }: TSendDetailsItemProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'sendDetails' })
  const { contacts } = useContactsSelector()
  const navigation = useNavigation()

  const contact = contacts.find(contact => contact.addresses.some(AccountHelper.predicate({ address, blockchain })))

  return (
    <Details.Panel labelClassName="text-gray-100 text-sm" label={t('transferLabel', { order })}>
      <Details.Item label={t('recipientLabel')} contentClassName="flex-col items-start gap-3">
        <Text className="font-sans-medium text-base text-white">{contact?.name || address}</Text>

        {txId && !contact && (
          <View>
            <TwButton
              label={t('saveContactButtonLabel')}
              labelProps={{ className: 'text-sm' }}
              contentProps={{ className: 'gap-2' }}
              variant="text-slim"
              leftElement={<TbUsers aria-hidden className="size-5 text-neon" />}
              onPress={() =>
                navigation.navigate('PersistContactModal', {
                  addresses: [{ blockchain, address }],
                })
              }
            />
          </View>
        )}
      </Details.Item>

      <Details.ItemSeparator />

      <Details.Item label={t('amountLabel')} contentClassName="flex-row justify-start">
        <Text className="font-sans-medium text-base text-white">{amount}</Text>

        {!!token?.symbol && <Text className="font-sans-medium text-base text-gray-100">{token.symbol}</Text>}
      </Details.Item>
    </Details.Panel>
  )
}

export const SendDetails = ({ data, blockchain, fee }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'sendDetails' })

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  return (
    <View className="gap-2">
      <Details.Root>
        <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('detailsLabel')}</Details.Header>

        <Details.HeaderSeparator />

        <Details.Body>
          {data.map(({ txId, items }, index) => (
            <Details.Panel key={`send-details-data-${index}`} label={t('transactionLabel', { order: index + 1 })}>
              {txId && (
                <Details.Item label={t('transactionHashLabel')} textToCopy={txId}>
                  {txId}
                </Details.Item>
              )}

              {items.map(({ address, amount, token }, itemIndex) => (
                <SendDetailsItem
                  key={`send-details-item-${itemIndex}`}
                  txId={txId}
                  address={address}
                  amount={amount}
                  token={token}
                  blockchain={blockchain}
                  order={itemIndex + 1}
                />
              ))}
            </Details.Panel>
          ))}
        </Details.Body>
      </Details.Root>

      <Details.Root>
        <Details.Item label={t('totalFeeLabel')} className="p-0">
          <View className="flex-row items-center">
            <TwBlockchainIcon blockchain={blockchain} type="gray" className="mr-2 mt-0.5 size-3.5" />

            <Text className="font-sans-regular text-base text-white">{service.feeToken.symbol}</Text>
          </View>

          <Text className="font-sans-medium text-base text-white">{fee}</Text>
        </Details.Item>
      </Details.Root>
    </View>
  )
}
