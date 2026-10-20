import React, { useState } from 'react'

import { BSUtilsHelper } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import WebView from 'react-native-webview'
import type { WebViewOpenWindowEvent } from 'react-native-webview/lib/WebViewTypes'

import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { BuyAndSellTokensHelper } from '@/helpers/BuyAndSellTokensHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import MdRestartAlt from '@/assets/images/md-restart-alt.svg'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'

import type { TDepositActionsData } from './index'

import type { TBuyAndSellTokensHelperType } from '@/types/helpers'
import type { TAccount } from '@/types/store'

type TProps = {
  type: TBuyAndSellTokensHelperType
  hidden: boolean
  account?: TAccount
  setDepositActionsData?: Dispatch<TDepositActionsData | null>
}

export const BuyAndSellTokensIframeContent = ({ type, hidden, account, setDepositActionsData }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'buyAndSellTokens.iframeContent' })
  const { currency } = useCurrencySelector()
  const navigation = useNavigation()

  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [hasIframeError, setHasIframeError] = useState(false)
  const [id, setId] = useState(UtilsHelper.uuid())

  const url = BuyAndSellTokensHelper.buildUrl({
    type,
    currency,
    refundAddress: account?.address,
    merchantTransactionId: id,
  })

  const handleRestart = () => {
    if (isIframeLoading) return

    AlertHelper.show({
      title: t('restartAlert.titleLabel'),
      subtitle: t('restartAlert.subtitleLabel'),
      buttons: [
        { label: t('restartAlert.noButtonLabel') },
        {
          label: t('restartAlert.yesButtonLabel'),
          onPress: () => {
            setDepositActionsData?.(null)
            setHasIframeError(false)
            setIsIframeLoading(true)
            setId(UtilsHelper.uuid())
          },
        },
      ],
    })
  }

  const handleLoad = async () => {
    await BSUtilsHelper.wait(4000)

    setIsIframeLoading(false)
  }

  const handleError = () => {
    setIsIframeLoading(false)
    setHasIframeError(true)
  }

  const handleOpenWindow = ({ nativeEvent }: WebViewOpenWindowEvent) => {
    if (nativeEvent.targetUrl.startsWith('https://')) LinkHelper.open(nativeEvent.targetUrl)
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View
      className={StyleHelper.mergeStyles('w-full flex-shrink flex-grow', {
        'fixed top-[-9999px] h-0 max-h-0 min-h-0 w-0 min-w-0 max-w-0': hidden,
      })}
    >
      <Skeleton.Root loading={isIframeLoading} className="relative flex-1">
        <Skeleton.Group>
          <Skeleton.Item />
        </Skeleton.Group>

        <Skeleton.Content
          forceMount
          className={StyleHelper.mergeStyles(
            'flex-1 overflow-hidden rounded-lg border border-gray-300/15 opacity-100',
            {
              'absolute left-0 top-0': isIframeLoading,
            }
          )}
        >
          {hasIframeError || !url ? (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-center font-sans-regular text-2xl text-white">{t('error')}</Text>
            </View>
          ) : (
            <WebView
              source={{ uri: url }}
              nestedScrollEnabled
              containerClassName="size-full"
              originWhitelist={['*']}
              onLoad={handleLoad}
              onError={handleError}
              onOpenWindow={handleOpenWindow}
            />
          )}
        </Skeleton.Content>
      </Skeleton.Root>

      <View className="mt-4 flex w-full flex-row items-center justify-between">
        <TwButton
          label={t('buttons.back')}
          variant="card"
          className="h-11 w-[48%]"
          contentProps={{ className: 'gap-x-2 items-center' }}
          labelProps={{ className: 'w-fit' }}
          leftElement={<TbArrowLeft aria-hidden className="size-5 fill-neon min-size-5" />}
          onPress={handleBack}
        />

        <TwButton
          label={t('buttons.restart')}
          variant="card"
          className="h-11 w-[48%]"
          disabled={isIframeLoading}
          contentProps={{ className: 'gap-x-2 items-center' }}
          labelProps={{ className: 'w-fit' }}
          leftElement={<MdRestartAlt aria-hidden className="size-5 fill-neon min-size-5" />}
          onPress={handleRestart}
        />
      </View>
    </View>
  )
}
