import React from 'react'

import type { ISwapOrchestrator, TSwapOrchestratorState } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ActionStep } from '@/components/ActionStep'
import { TwIconButton } from '@/components/TwIconButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import TbHelp from '@/assets/images/tb-help.svg'
import TbMessage from '@/assets/images/tb-message.svg'

type TProps = {
  swapOrchestrator: ISwapOrchestrator
  state: TSwapOrchestratorState
  disabled: boolean
}

export const SwapScreenExtraIdCard = ({ swapOrchestrator, state, disabled }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swap.extraIdCard' })
  const navigation = useNavigation()

  const handleChange = (extraId: string) => {
    swapOrchestrator.setExtraId(extraId || null)
  }

  return (
    <View className="mt-3 rounded bg-gray-700/60 px-1 py-2">
      <ActionStep
        leftElement={<TbMessage aria-hidden className="text-blue" />}
        className="gap-x-2"
        title={
          <View className="flex-row items-center">
            <Text numberOfLines={1} className="font-sans-regular text-lg text-white">
              {t('extraIdToReceiveLabel')}
            </Text>

            <TwIconButton
              className="ml-1.5 p-0"
              aria-label={t('openAboutExtraIdToReceive')}
              size="md"
              icon={<TbHelp aria-hidden className="mt-1 size-5 text-neon min-size-5 max-size-5" />}
              onPress={() => navigation.navigate('AboutExtraIdToReceiveModal')}
            />
          </View>
        }
      />

      <TwSeparator />

      <View className="px-2 py-3">
        <TwInput
          aria-label={t('extraIdToReceiveLabel')}
          placeholder={t('extraIdToReceivePlaceholder')}
          pastable
          disabled={disabled}
          value={state.extraId.value || ''}
          onChangeText={handleChange}
        />
      </View>
    </View>
  )
}
