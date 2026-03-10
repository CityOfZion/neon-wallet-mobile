import { useRef } from 'react'

import { hasFullTransactions } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import type { SectionListData, SectionListRenderItem } from 'react-native'
import { SectionList, Text } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { RefreshControl } from '@/components/RefreshControl'
import { Skeleton } from '@/components/Skeleton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useTransactionsQuery } from '@/hooks/useTransactionsQuery'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'
import { TwScreenLayoutButton } from '@/layouts/TwScreenLayout/TwScreenLayoutButtons'

import { AccountTransactionsScreenTransactionItem } from './AccountTransactionsScreenTransactionItem'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TUseTransactionsGroupedTransactionsByDate, TUseTransactionsTransaction } from '@/types/store'

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<TUseTransactionsTransaction, TUseTransactionsGroupedTransactionsByDate>
}) => <Text className="mb-3 ml-1 mt-6 font-sans-medium text-2xl text-white">{section.formattedDate}</Text>

const renderItem: SectionListRenderItem<TUseTransactionsTransaction, TUseTransactionsGroupedTransactionsByDate> = ({
  item,
  index,
}) => (
  <AccountTransactionsScreenTransactionItem
    className={StyleHelper.mergeStyles({
      'mt-2.5': index !== 0,
    })}
    key={item.txId}
    transaction={item}
  />
)

const AccountTransactionsScreen = (props: TWalletsStackScreenProps<'AccountTransactionsScreen'>) => {
  const { account } = props.route.params
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { isFetchingNextPage, fetchNextPage, isLoading, aggregatedData, isRefetching, refetch } =
    useTransactionsQuery(account)

  const onEndReachedCalledDuringMomentum = useRef(true)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const shouldShowExportButton = hasFullTransactions(service)

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum.current && !isFetchingNextPage && !isLoading && !isRefetching) {
      fetchNextPage()
      onEndReachedCalledDuringMomentum.current = true
    }
  }

  const handleMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false
  }

  const handleExportPress = () => {
    props.navigation.navigate('ExportFullTransactionsModal', {
      account,
    })
  }

  return (
    <TwScreenLayout
      title={t('title')}
      withoutScroll
      rightElement={
        shouldShowExportButton ? (
          <TwScreenLayoutButton label={t('exportButtonLabel')} onPress={handleExportPress} />
        ) : undefined
      }
      contentContainerClassName="pb-0"
    >
      <AccountSubTitle account={account} />

      <SectionList
        stickySectionHeadersEnabled={false}
        className="mt-2 w-full"
        contentContainerClassName="pb-4.5 flex-grow"
        sections={aggregatedData}
        ListFooterComponent={
          isLoading || isFetchingNextPage ? (
            <Skeleton.Root className="mt-2.5">
              <Skeleton.Group>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton.Item key={`transaction-skeleton-${index}`} className="h-52 w-full" />
                ))}
              </Skeleton.Group>
            </Skeleton.Root>
          ) : undefined
        }
        ListEmptyComponent={!isLoading ? <FlatListEmpty label={t('emptyList')} /> : undefined}
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
