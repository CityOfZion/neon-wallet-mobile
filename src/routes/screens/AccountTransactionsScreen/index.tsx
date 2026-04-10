import React, { useRef } from 'react'

import { hasFullTransactions } from '@cityofzion/blockchain-service'
import * as dateFns from 'date-fns'
import { useTranslation } from 'react-i18next'
import type { SectionListData, SectionListRenderItem } from 'react-native'
import { SectionList, Text, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { RefreshControl } from '@/components/RefreshControl'
import { Skeleton } from '@/components/Skeleton'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwIconButton } from '@/components/TwIconButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useActions } from '@/hooks/useActions'
import { useTransactionsQuery } from '@/hooks/useTransactionsQuery'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'

import { AccountTransactionsScreenTransactionDefault } from './AccountTransactionsScreenTransactionDefault'
import { AccountTransactionsScreenTransactionUtxo } from './AccountTransactionsScreenTransactionUtxo'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TUseTransactionsGroupedTransactionsByDate, TUseTransactionsTransaction } from '@/types/store'

type TActionsData = {
  dateFrom?: Date
  dateTo?: Date
}

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<TUseTransactionsTransaction, TUseTransactionsGroupedTransactionsByDate>
}) => <Text className="mb-3 ml-1 mt-6 font-sans-medium text-xl text-white">{section.formattedDate}</Text>

const renderItem: SectionListRenderItem<TUseTransactionsTransaction, TUseTransactionsGroupedTransactionsByDate> = ({
  item,
  index,
}) => (
  <View key={item.txId} className={StyleHelper.mergeStyles({ 'mt-2': index !== 0 })}>
    {item.view === 'utxo' ? (
      <AccountTransactionsScreenTransactionUtxo transaction={item} />
    ) : (
      <AccountTransactionsScreenTransactionDefault transaction={item} />
    )}
  </View>
)

const AccountTransactionsScreen = ({ navigation, route }: TWalletsStackScreenProps<'AccountTransactionsScreen'>) => {
  const { account } = route.params
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { t: tBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  const blockchain = account.blockchain
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const hasServiceFullTransactions = hasFullTransactions(service)
  const dateNow = new Date()

  const {
    actionData: { dateFrom, dateTo },
    setData,
  } = useActions<TActionsData>({
    dateFrom: hasServiceFullTransactions ? dateFns.startOfMonth(dateNow) : undefined,
    dateTo: hasServiceFullTransactions ? dateNow : undefined,
  })

  const { isFetchingNextPage, fetchNextPage, isLoading, aggregatedData, isRefetching, refetch } = useTransactionsQuery({
    account,
    dateFrom,
    dateTo,
  })

  const onEndReachedCalledDuringMomentum = useRef(true)

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum.current && !isFetchingNextPage && !isLoading && !isRefetching) {
      fetchNextPage()

      onEndReachedCalledDuringMomentum.current = true
    }
  }

  const handleMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false
  }

  const handleDatesChange = (dateFrom: Date, dateTo: Date) => {
    setData({ dateFrom, dateTo })
  }

  const handleContextPress = () => {
    if (!hasServiceFullTransactions) return

    navigation.navigate('AccountTransactionsContextModal', {
      account,
      dateFrom: dateFrom!,
      dateTo: dateTo!,
      onDatesChange: handleDatesChange,
    })
  }

  return (
    <TwScreenLayout
      title={t('title')}
      withoutScroll
      rightElement={
        hasServiceFullTransactions ? (
          <TwIconButton
            aria-label={t('contextButtonLabel')}
            icon={<MdMoreHoriz aria-hidden className="text-white" />}
            onPress={handleContextPress}
          />
        ) : undefined
      }
      contentContainerClassName="pb-0"
    >
      <View className="mb-2 flex w-full flex-row items-center justify-between px-1">
        <View className="flex flex-row items-center gap-x-2">
          <TwBlockchainIcon blockchain={blockchain} type="default" className="size-4" />

          <Text className="font-sans-regular text-base uppercase text-white">
            {tBlockchainServices(`${blockchain}.label`)}
          </Text>
        </View>

        <AccountSubTitle account={account} />
      </View>

      <SectionList
        stickySectionHeadersEnabled={false}
        className="w-full"
        contentContainerClassName="pb-8 flex-grow"
        sections={aggregatedData}
        ListFooterComponent={
          isLoading || isFetchingNextPage ? (
            <Skeleton.Root className="mt-2">
              <Skeleton.Group>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton.Item key={`transactions-skeleton-${index}`} className="h-44 w-full bg-gray-900" />
                ))}
              </Skeleton.Group>
            </Skeleton.Root>
          ) : undefined
        }
        ListEmptyComponent={!isLoading ? <FlatListEmpty label={t('emptyList')} className="py-8" /> : undefined}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        renderItem={renderItem}
      />
    </TwScreenLayout>
  )
}

export default AccountTransactionsScreen
