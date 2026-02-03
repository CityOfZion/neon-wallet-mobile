import React, { Fragment } from 'react'

import { SimpleSwapService } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'

import { TwIconButton } from '@/components/TwIconButton'
import { TwSkeleton } from '@/components/TwSkeleton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

const swapService = new SimpleSwapService()

export const SwapDetailsLogModal = ({ route }: TRootStackScreenProps<'SwapDetailsLogModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsLogModal' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })

  const {
    swapRecord: { swapId, ...swapRecord },
  } = route.params

  const { isLoading, data: log } = useQuery({
    queryKey: ['swap-details-log', swapId, swapRecord.txFrom, swapRecord.txTo],
    queryFn: async () => {
      let finalLog = swapRecord.log

      if (!finalLog) {
        const response = await swapService.getStatus(swapId!)

        if (response.log) finalLog = response.log
      }

      return JSON.stringify(JSON.parse(finalLog ?? ''), null, 1)
    },
  })

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <TwSkeleton
        className="mt-2 flex-grow"
        isLoading={isLoading}
        layout={[
          { width: '100%', height: 48 },
          { width: '100%', height: 232 },
        ]}
      >
        {log ? (
          <Fragment>
            <View className="my-4 w-full flex-row items-center justify-between gap-2">
              <Text className="font-sans-medium text-lg text-gray-300">{t('copySwapLog')}</Text>

              <TwIconButton
                aria-label={tCommon('copy')}
                size="sm"
                icon={<TbCopy aria-hidden className="text-neon" />}
                onPress={() => ClipboardHelper.write(log)}
              />
            </View>

            <ScrollView
              contentContainerClassName="w-full flex-grow p-4 rounded bg-gray-900/75"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              disableScrollViewPanResponder
            >
              <Text className="font-sans-regular text-sm text-white">{log}</Text>
            </ScrollView>
          </Fragment>
        ) : (
          <Text className="text-center font-sans-medium text-lg text-gray-300">{t('thereIsNoLog')}</Text>
        )}
      </TwSkeleton>
    </TwModalLayout>
  )
}
