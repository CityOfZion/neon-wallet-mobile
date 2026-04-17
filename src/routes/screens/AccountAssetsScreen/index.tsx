import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import { BalanceList } from '@/components/BalanceList'
import { RefreshControl } from '@/components/RefreshControl'
import { Skeleton } from '@/components/Skeleton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwTabs } from '@/components/TwTabs'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { DateHelper } from '@/helpers/DateHelper'

import { useBalance } from '@/hooks/useBalances'
import { useCurrencySelector, useLanguageSelector } from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'
import TbRefresh from '@/assets/images/tb-refresh.svg'

import type { TTokenBalance, TUseBalanceOptionShowType } from '@/types/query'
import type { TWalletsStackScreenProps } from '@/types/stacks'

const AccountAssetScreen = ({ route, navigation }: TWalletsStackScreenProps<'AccountAssetsScreen'>) => {
  const { account, wallet } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'accountAssets' })
  const { currency } = useCurrencySelector()
  const { language } = useLanguageSelector()

  const [tab, setTab] = useState<TUseBalanceOptionShowType>('active')

  const balanceQuery = useBalance(account, { showType: tab })

  const handleItemLongPress = (tokenBalance: TTokenBalance) => {
    navigation.navigate('AccountAssetTokenActionsModal', {
      tokenBalance,
      showType: tab,
    })
  }
  const handlePressMore = () => {
    navigation.navigate('AccountAssetActionsModal', {
      account,
      wallet,
    })
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <View className="absolute right-0 flex-row">
          <TwIconButton icon={<TbRefresh aria-hidden className="text-neon" />} onPress={balanceQuery.refetch} />
          <TwIconButton icon={<MdMoreHoriz aria-hidden className="text-white" />} onPress={handlePressMore} />
        </View>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent>
        <BalanceList
          accounts={[account]}
          showType={tab}
          onItemLongPress={handleItemLongPress}
          refreshControl={<RefreshControl refreshing={balanceQuery.isRefetching} onRefresh={balanceQuery.refetch} />}
          ListHeaderComponent={
            <View className="mb-5">
              <AccountSubTitle account={account} />

              <TwTabs.Root
                value={tab}
                onValueChange={value => setTab(value as TUseBalanceOptionShowType)}
                className="mt-6"
              >
                <View className="items-center">
                  <TwTabs.List>
                    <TwTabs.Trigger label={t('tabs.activeLabel')} value="active" />
                    <TwTabs.Trigger label={t('tabs.hiddenLabel')} value="hidden" />
                  </TwTabs.List>

                  <Text className="mb-2 mt-8.5 font-sans-semibold text-sm uppercase text-gray-100">
                    {t('balanceLabel')}
                  </Text>

                  <Skeleton.Root loading={balanceQuery.isLoading} className="mt-2 h-9 items-center">
                    <Skeleton.Group>
                      <Skeleton.Item className="w-24" />
                    </Skeleton.Group>

                    <Skeleton.Content>
                      <Text className="font-sans-regular text-4xl text-white" numberOfLines={1}>
                        {CurrencyHelper.format(balanceQuery.data?.exchangeTotal, { currency })}
                      </Text>
                    </Skeleton.Content>
                  </Skeleton.Root>

                  <Text className="mt-1 font-sans-regular text-xs text-gray-300">{`${t('lastUpdatedLabel')} ${DateHelper.formatLocalized(balanceQuery.dataUpdatedAt, { format: 'p', language })}`}</Text>
                </View>
              </TwTabs.Root>
            </View>
          }
        />
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}

export default AccountAssetScreen
