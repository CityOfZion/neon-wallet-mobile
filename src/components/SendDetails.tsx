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

import type { TUseTransactionsTransaction, TUseTransactionsTransactionEvent } from '@/types/store'

type TProps = {
  transactions: TUseTransactionsTransaction[]
  fee?: string
}

type TSendEventDetailsProps = {
  event: TUseTransactionsTransactionEvent
  transaction: TUseTransactionsTransaction
  order: number
}

const SendEventDetails = ({ event, transaction, order }: TSendEventDetailsProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'sendDetails' })
  const { contacts } = useContactsSelector()
  const navigation = useNavigation()

  const contact = contacts.find(contact =>
    contact.addresses.some(AccountHelper.predicate({ address: event.to!, blockchain: transaction.blockchain }))
  )

  return (
    <Details.Panel labelClassName="text-gray-100 text-sm" label={t('transferLabel', { order })}>
      <Details.Item label={t('recipientLabel')} contentClassName="flex-col items-start gap-3">
        <Text className="font-sans-medium text-base text-white">{contact?.name || event.to}</Text>

        {transaction.txId && !contact && (
          <View>
            <TwButton
              label={t('saveContactButtonLabel')}
              labelProps={{
                className: 'text-sm',
              }}
              contentProps={{
                className: 'gap-2',
              }}
              leftElement={<TbUsers aria-hidden className="size-5 text-neon" />}
              variant="text-slim"
              onPress={() =>
                navigation.navigate('PersistContactModal', {
                  addresses: [{ blockchain: transaction.blockchain, address: event.to! }],
                })
              }
            />
          </View>
        )}
      </Details.Item>

      <Details.ItemSeparator />

      {event.eventType === 'token' && (
        <Details.Item label={t('amountLabel')} contentClassName="flex-row justify-start">
          <Text className="font-sans-medium text-base text-white">{event.amount}</Text>
          {!!event.token?.name && <Text className="font-sans-medium text-base text-gray-100">{event.token.name}</Text>}
        </Details.Item>
      )}
    </Details.Panel>
  )
}

export const SendDetails = ({ transactions, fee }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'sendDetails' })

  // Assuming all transactions are from the same token and blockchain, as they come from the same send action
  const blockchain = transactions[0].blockchain

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  return (
    <View className="gap-2">
      <Details.Root>
        <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('detailsLabel')}</Details.Header>

        <Details.HeaderSeparator />

        <Details.Body>
          {transactions.map((transaction, index) => (
            <Details.Panel
              key={`send-details-transaction-${index}`}
              label={t('transactionLabel', { order: index + 1 })}
            >
              {transaction.txId && (
                <Details.Item label={t('transactionHashLabel')} textToCopy={transaction.txId}>
                  {transaction.txId}
                </Details.Item>
              )}

              {transaction.events.map((event, eventIndex) => (
                <SendEventDetails
                  key={`send-details-event-${eventIndex}`}
                  event={event}
                  order={eventIndex + 1}
                  transaction={transaction}
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
            <Text className="font-sans-regular text-base text-white">{service.feeToken.name}</Text>
          </View>

          <Text className="font-sans-medium text-base text-white">{fee}</Text>
        </Details.Item>
      </Details.Root>
    </View>
  )
}
