import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdCircle from '@/assets/images/md-circle.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  neo3Account?: TAccount
  isDisabled: boolean
  onSelect(neo3Account: TAccount): void
}

export const VoteNeo3Account = ({ neo3Account, isDisabled, onSelect }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'voteNeo3Screen.account' })
  const navigation = useNavigation()

  const handleGoToAccountSelectionModal = () => {
    navigation.navigate('AccountSelectionModal', {
      title: t('selectNeo3AccountTitle'),
      blockchains: ['neo3'],
      onSelect,
    })
  }

  return (
    <View className="flex w-full flex-row gap-x-2">
      <MdCircle
        className="mt-1 size-3.5 text-neon"
        style={
          neo3Account?.skin?.type === 'color' && !!neo3Account?.skin?.id
            ? ({ color: neo3Account.skin.id } as StyleProp<ViewStyle>)
            : undefined
        }
      />

      <View className="flex flex-col gap-y-1">
        {neo3Account?.name && (
          <Text className="font-sans-regular text-sm uppercase text-white">{neo3Account.name}</Text>
        )}

        <View className="flex flex-row items-center gap-x-2">
          <Text
            className={StyleHelper.mergeStyles('w-fit font-sans-medium text-sm text-gray-100', {
              'w-full max-w-24': neo3Account,
            })}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {neo3Account?.address || t('noAccountSelectedLabel')}
          </Text>

          <TwButton
            label={neo3Account ? t('changeLabel') : t('selectLabel')}
            variant="text-slim"
            disabled={isDisabled}
            contentProps={{ className: 'w-fit flex-shrink-0 flex-grow-0' }}
            labelProps={{ className: 'text-sm' }}
            onPress={handleGoToAccountSelectionModal}
          />
        </View>
      </View>
    </View>
  )
}
