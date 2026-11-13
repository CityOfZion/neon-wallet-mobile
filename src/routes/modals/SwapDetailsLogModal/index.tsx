import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { ScrollView, Text } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { useSwapOrderQuery } from '@/hooks/useSwapOrderQuery'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const SwapDetailsLogModal = ({ route }: TRootStackScreenProps<'SwapDetailsLogModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsLog' })

  const { orderId } = route.params

  const swapOrderQuery = useSwapOrderQuery(orderId)

  const log = useMemo(() => {
    if (!swapOrderQuery.data?.log) return ''

    try {
      return JSON.stringify(JSON.parse(swapOrderQuery.data.log), null, 1)
    } catch {
      return swapOrderQuery.data.log
    }
  }, [swapOrderQuery.data?.log])

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ViewContent>
        <Skeleton.Root loading={swapOrderQuery.isLoading} className="w-full flex-1">
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
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
