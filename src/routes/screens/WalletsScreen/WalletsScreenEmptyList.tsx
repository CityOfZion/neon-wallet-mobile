import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'

import { getWalletCardDimensions } from '@/components/WalletCard'

import MdAdd from '@/assets/images/md-add.svg'

const walletCardDimensions = getWalletCardDimensions()

export const WalletsScreenEmptyList = () => {
  const navigation = useNavigation()
  const { t } = useTranslation('screens', { keyPrefix: 'wallets' })

  const handlePress = () => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'CreateWalletStep1Screen',
      },
    })
  }

  return (
    <View className="w-full items-center">
      <Pressable
        onPress={handlePress}
        className="my-9 flex-row items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-300/50"
        style={{
          width: walletCardDimensions.width,
          height: walletCardDimensions.height,
        }}
      >
        <MdAdd aria-hidden className="h-7 w-7 text-white" />

        <Text className="font-sans-medium text-lg text-white"> {t('createFirstWallet')}</Text>
      </Pressable>
    </View>
  )
}
