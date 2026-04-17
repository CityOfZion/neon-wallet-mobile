import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { NavigationAction } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwTabs } from '@/components/TwTabs'

import { AlertHelper } from '@/helpers/AlertHelper'
import { EnvHelper } from '@/helpers/EnvHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdHelpOutline from '@/assets/images/md-help-outline.svg'

import { BuyAndSellTokensIframeContent } from './BuyAndSellTokensIframeContent'

import type { TTokenSelectionModalToken } from '@/types/modals'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

export type TDepositActionsData = {
  amount: string
  isAmountLoading: boolean
  address: string
  isFeeLoading: boolean
  fee?: string
  token?: TTokenSelectionModalToken
  account?: TAccount
}

export enum EBuyAndSellTokensScreenTabValue {
  BUY_TOKENS = 'buy-tokens',
  SELL_TOKENS = 'sell-tokens',
}

export const BuyAndSellTokensScreen = ({ navigation, route }: TWalletsStackScreenProps<'BuyAndSellTokensScreen'>) => {
  const { account, screenType } = route.params || {}

  const { t } = useTranslation('screens', { keyPrefix: 'buyAndSellTokens' })
  const [tabValue, setTabValue] = useState(screenType || EBuyAndSellTokensScreenTabValue.BUY_TOKENS)
  const [depositActionsData, setDepositActionsData] = useState<TDepositActionsData | null>(null)
  const nextActionRef = useRef<NavigationAction | null>(null)

  const handleChangeTabValue = (newTabValue: string) => {
    setTabValue(newTabValue as EBuyAndSellTokensScreenTabValue)
  }

  const handleAccounts = () => {
    navigation.navigate('BuyAndSellTokensAccountsModal', { account })
  }

  const handleDeposit = () => {
    navigation.navigate('SellTokensDepositModal', { account, depositActionsData, setDepositActionsData })
  }

  const handleInfo = () => {
    navigation.navigate('BuyAndSellTokensInfoModal')
  }

  const handleLeaveAlert = () => {
    if (!nextActionRef.current) return

    AlertHelper.show({
      title: t('leaveAlert.title'),
      subtitle: t('leaveAlert.subtitle'),
      buttons: [
        { label: t('leaveAlert.buttons.cancel') },
        {
          label: t('leaveAlert.buttons.continue'),
          onPress: () => {
            navigation.dispatch(nextActionRef.current!)
            nextActionRef.current = null
          },
        },
      ],
    })
  }

  useEffect(() => {
    return navigation.addListener('beforeRemove', event => {
      event.preventDefault()

      const { action } = event.data
      const lastRouteName = UtilsHelper.getLastRouteName(action)

      navigation.navigate('BuyAndSellTokensScreen', { account })

      if (lastRouteName === 'BuyAndSellTokensScreen') return

      nextActionRef.current = action

      handleLeaveAlert()
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  useEffect(() => {
    if (screenType) {
      setTabValue(screenType)
    }
  }, [screenType])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header className="h-[56px]">
        {EBuyAndSellTokensScreenTabValue.SELL_TOKENS === tabValue && (
          <TwButton
            className="absolute left-0 ml-2"
            label={t('buttons.deposit')}
            variant="text-slim"
            labelProps={{ className: 'font-sans-medium' }}
            onPress={handleDeposit}
          />
        )}
        <View className="-mt-1 flex max-w-[50%] flex-1 flex-row items-center justify-center">
          <Text className="line-clamp-1 font-sans-medium text-xl text-white">{t('title')}</Text>
          <TwIconButton
            aria-label={t('buttons.info')}
            size="sm"
            className="mt-1"
            icon={<MdHelpOutline className="fill-neon" aria-hidden />}
            onPress={handleInfo}
          />
        </View>
        <TwButton
          className="absolute right-0 mr-2"
          label={t('buttons.accounts')}
          variant="text-slim"
          labelProps={{ className: 'font-sans-medium' }}
          onPress={handleAccounts}
        />
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <Fragment>
          <View className="w-full">
            <TwTabs.Root
              value={tabValue}
              onValueChange={handleChangeTabValue}
              className="-mt-2 mb-4 flex-shrink-0 flex-grow-0"
            >
              <TwTabs.List>
                <TwTabs.Trigger value={EBuyAndSellTokensScreenTabValue.BUY_TOKENS} label={t('tabs.buyTokens')} />
                <TwTabs.Trigger value={EBuyAndSellTokensScreenTabValue.SELL_TOKENS} label={t('tabs.sellTokens')} />
              </TwTabs.List>
            </TwTabs.Root>
          </View>

          {/* We aren't using the <TwTabs.Content /> because we need to load the two <WebView /> in the same screen */}
          {EnvHelper.EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL && (
            <BuyAndSellTokensIframeContent
              baseUrl={EnvHelper.EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL}
              hidden={EBuyAndSellTokensScreenTabValue.BUY_TOKENS !== tabValue}
              account={account}
            />
          )}

          {EnvHelper.EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL && (
            <BuyAndSellTokensIframeContent
              baseUrl={EnvHelper.EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL}
              hidden={EBuyAndSellTokensScreenTabValue.SELL_TOKENS !== tabValue}
              account={account}
              setDepositActionsData={setDepositActionsData}
            />
          )}
        </Fragment>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
