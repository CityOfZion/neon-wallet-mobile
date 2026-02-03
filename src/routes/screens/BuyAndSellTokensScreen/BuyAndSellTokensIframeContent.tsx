import React, { useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import WebView from 'react-native-webview'

import { TwButton } from '@/components/TwButton'
import { TwSkeleton } from '@/components/TwSkeleton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { BuyAndSellTokensHelper } from '@/helpers/BuyAndSellTokensHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import MdRestartAlt from '@/assets/images/md-restart-alt.svg'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'

import type { TDepositActionsData } from './index'

import type { IAccountState } from '@/types/store'

type TProps = {
  baseUrl: string
  hidden: boolean
  account?: IAccountState
  setDepositActionsData?: Dispatch<TDepositActionsData | null>
}

export const BuyAndSellTokensIframeContent = ({ baseUrl, hidden, account, setDepositActionsData }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'buyAndSellTokensScreen.iframeContent' })
  const { currency } = useCurrencySelector()
  const navigation = useNavigation()

  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [hasIframeError, setHasIframeError] = useState(false)
  const [iframeId, setIframeId] = useState(UtilsHelper.uuid())

  const url = BuyAndSellTokensHelper.buildIframeUrl({ id: iframeId, baseUrl, currency, account })

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
            setIframeId(UtilsHelper.uuid())
          },
        },
      ],
    })
  }

  const handleLoad = async () => {
    await UtilsHelper.sleep(4000)

    setIsIframeLoading(false)
  }

  const handleError = () => {
    setIsIframeLoading(false)
    setHasIframeError(true)
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
      {isIframeLoading && (
        <View className="flex-1">
          <TwSkeleton
            isLoading
            className="flex w-full"
            layout={{
              width: '100%',
              colors: ['#ffffff08', 'transparent'],
            }}
          />
        </View>
      )}

      {hasIframeError ? (
        <Text className="mt-2 flex-grow px-4 text-center font-sans-regular text-lg text-white">{t('error')}</Text>
      ) : (
        <WebView
          source={{ uri: url }}
          nestedScrollEnabled
          originWhitelist={['*']}
          style={{ flex: 1 }}
          containerStyle={{
            ...(isIframeLoading ? { position: 'absolute', top: -9999, height: 0 } : {}),
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      <View className="mb-2 mt-4 flex w-full flex-row items-center justify-between">
        <TwButton
          label={t('buttons.back')}
          variant="card"
          className="h-11 w-[48%]"
          contentProps={{ className: 'gap-x-2 items-center' }}
          labelProps={{ className: 'w-fit' }}
          leftElement={<TbArrowLeft aria-hidden className="h-5 min-h-5 w-5 min-w-5 fill-neon" />}
          onPress={handleBack}
        />

        <TwButton
          label={t('buttons.restart')}
          variant="card"
          className="h-11 w-[48%]"
          disabled={isIframeLoading}
          contentProps={{ className: 'gap-x-2 items-center' }}
          labelProps={{ className: 'w-fit' }}
          leftElement={<MdRestartAlt aria-hidden className="h-5 min-h-5 w-5 min-w-5 fill-neon" />}
          onPress={handleRestart}
        />
      </View>
    </View>
  )
}
