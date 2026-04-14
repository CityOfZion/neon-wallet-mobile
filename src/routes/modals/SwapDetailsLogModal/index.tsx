import React from 'react'

import { SimpleSwapService } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

const swapService = new SimpleSwapService()

export const SwapDetailsLogModal = ({ route }: TRootStackScreenProps<'SwapDetailsLogModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsLog' })

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

      return finalLog ? JSON.stringify(JSON.parse(finalLog), null, 1) : ''
    },
  })

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <Skeleton.Root loading={isLoading} className="w-full flex-1">
        <Skeleton.Group>
          <Skeleton.Item />
        </Skeleton.Group>

        <Skeleton.Content className="w-full flex-1 rounded-lg bg-gray-900/75 p-4">
          {log ? (
            <ScrollView
              className="w-full flex-1"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              disableScrollViewPanResponder
            >
              <Text className="font-sans-regular text-sm text-white">{log}</Text>
            </ScrollView>
          ) : (
            <Text className="text-center font-sans-medium text-lg text-gray-300">{t('thereIsNoLog')}</Text>
          )}
        </Skeleton.Content>
      </Skeleton.Root>

      <TwButton
        variant="contained-light"
        className="mt-6"
        label={t('copySwapLog')}
        rightElement={<TbCopy aria-hidden />}
        disabled={!log}
        onPress={() => ClipboardHelper.write(log!)}
      />
    </TwModalLayout>
  )
}
