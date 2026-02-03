import { Fragment, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import type { SectionListData, SectionListRenderItem } from 'react-native'
import { SectionList, Text, View } from 'react-native'
import Animated, { Easing, withRepeat, withTiming } from 'react-native-reanimated'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { FlatListEmpty } from '@/components/FlatListEmpty'
import { FlatListFooter } from '@/components/FlatListFooter'
import { RefreshControl } from '@/components/RefreshControl'
import { ScreenLoader } from '@/components/ScreenLoader'

import { I18nextHelper } from '@/helpers/I18nextHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useTransactionsQuery } from '@/hooks/useTransactionsQuery'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'
import { TwScreenLayoutButton } from '@/layouts/TwScreenLayout/TwScreenLayoutButtons'

import MdCheckCircle from '@/assets/images/md-check-circle.svg'
import MdHistoryToggleOff from '@/assets/images/md-history-toggle-off.svg'

import { AccountTransactionsScreenTransactionItem } from './AccountTransactionsScreenTransactionItem'

import type { TUseTransactionsQueryAggregatedData } from '@/types/query'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TTransaction } from '@/types/store'

const { t } = I18nextHelper.get()

function RotateAnimation() {
  'worklet'

  const animations = {
    transform: [
      {
        rotateZ: withRepeat(
          withTiming(360, {
            duration: 1500,
            easing: Easing.linear,
          }),
          -1
        ),
      },
    ],
  }

  const initialValues = {
    transform: [{ rotateZ: '0deg' }],
  }

  return {
    initialValues,
    animations,
  }
}

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<TTransaction, TUseTransactionsQueryAggregatedData>
}) => (
  <Fragment>
    <Text className="mt-6 font-sans-medium text-2xl text-white">{section.localizedDate}</Text>

    {section.pendingData.length > 0 && (
      <Fragment>
        <View className="mb-3 mt-6 flex-row items-center gap-4">
          <Animated.View className="gap-2.5" entering={RotateAnimation as any}>
            <MdHistoryToggleOff aria-hidden className="h-6 w-6 text-gray-300" />
          </Animated.View>

          <Text className="font-sans-regular text-lg text-white">
            {t('screens:accountTransactionsScreen.pendingTransactions')}
          </Text>
        </View>

        {section.pendingData.map((transaction, index) => (
          <AccountTransactionsScreenTransactionItem
            className={StyleHelper.mergeStyles({
              'mt-2.5': index !== 0,
            })}
            key={`${transaction.hash}-transaction-${index}`}
            transaction={transaction}
          />
        ))}
      </Fragment>
    )}

    {section.data.length > 0 && (
      <View className="mb-3 mt-6 flex-row items-center gap-4">
        <MdCheckCircle aria-hidden className="h-6 w-6 text-gray-300" />

        <Text className="font-sans-regular text-lg text-white">
          {t('screens:accountTransactionsScreen.completedTransactions')}
        </Text>
      </View>
    )}
  </Fragment>
)

const renderItem: SectionListRenderItem<TTransaction, TUseTransactionsQueryAggregatedData> = ({ item, index }) => (
  <AccountTransactionsScreenTransactionItem
    className={StyleHelper.mergeStyles({
      'mt-2.5': index !== 0,
    })}
    key={`${item.hash}-transaction-${index}`}
    transaction={item}
  />
)

const AccountTransactionsScreen = (props: TWalletsStackScreenProps<'AccountTransactionsScreen'>) => {
  const { account } = props.route.params
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { isFetchingNextPage, fetchNextPage, isLoading, aggregatedData, isRefetching, refetch } =
    useTransactionsQuery(account)

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

  const handleExportPress = () => {
    props.navigation.navigate('ExportFullTransactionsModal', {
      account,
    })
  }

  return (
    <TwScreenLayout
      title={t('title')}
      withoutScroll
      rightElement={<TwScreenLayoutButton label={t('exportButtonLabel')} onPress={handleExportPress} />}
    >
      <AccountSubTitle account={account} />

      {isLoading ? (
        <ScreenLoader />
      ) : (
        <SectionList
          stickySectionHeadersEnabled={false}
          className="mt-2 w-full"
          sections={aggregatedData}
          ListFooterComponent={isFetchingNextPage ? <FlatListFooter /> : undefined}
          ListEmptyComponent={<FlatListEmpty label={t('emptyList')} />}
          onEndReached={handleEndReached}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={renderItem}
        />
      )}
    </TwScreenLayout>
  )
}

export default AccountTransactionsScreen
