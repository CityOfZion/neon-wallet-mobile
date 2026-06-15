import React, { useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import WebView from 'react-native-webview'

import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { BuyAndSellTokensHelper } from '@/helpers/BuyAndSellTokensHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import MdRestartAlt from '@/assets/images/md-restart-alt.svg'
import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'

import type { TDepositActionsData } from './index'

import type { TAccount } from '@/types/store'

type TProps = {
  baseUrl: string
  hidden: boolean
  account?: TAccount
  setDepositActionsData?: Dispatch<TDepositActionsData | null>
}

export const BuyAndSellTokensIframeContent = ({ baseUrl, hidden, account, setDepositActionsData }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'buyAndSellTokens.iframeContent' })
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
            <Text className="mt-2 flex-grow px-4 text-center font-sans-regular text-lg text-white">{t('error')}</Text>
          ) : (
            <WebView
              source={{ uri: url }}
              nestedScrollEnabled
              containerClassName="size-full"
              originWhitelist={['*']}
              onLoad={handleLoad}
              onError={handleError}
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
