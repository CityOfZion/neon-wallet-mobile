import { useState } from 'react'

import { WalletKitHelper } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import type { SessionTypes } from '@walletconnect/types'
import { Image } from 'expo-image'
import { Text, View } from 'react-native'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { useImageError } from '@/hooks/useImageError'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'
import { useWalletsMapSelector } from '@/hooks/useWalletSelector'

import { Loader } from './Loader'
import { TwMenuButton } from './TwMenuButton'

type Props = {
  session: SessionTypes.Struct
}

export const DappConnectionItem = ({ session }: Props) => {
  const navigation = useNavigation()
  const { accountsMapRef } = useAccountMapSelector()
  const { walletsMapRef } = useWalletsMapSelector()
  const { language } = useLanguageSelector()

  const [isLoading, setIsLoading] = useState(true)

  const info = WalletKitHelper.getSessionDetails({
    session,
    services: BlockchainServiceHelper.bsAggregator.blockchainServices,
  })

  const account = accountsMapRef.current.get(AccountHelper.buildAccountKey(info))
  const wallet = walletsMapRef.current.get(account?.idWallet ?? '')

  const { handleError, imageSource } = useImageError({
    source: {
      uri: session.peer.metadata.icons[0],
    },
    defaultSource: {
      uri: `${ConstantsHelper.neonIconsUrl}/dapps/default-dapp.png`,
    },
  })

  const handlePress = () => {
    navigation.navigate('DappConnectionDetailsModal', {
      session,
    })
  }

  return (
    <TwMenuButton
      onPress={handlePress}
      leftElementContainerClassName="w-10 h-10"
      leftElement={
        <View className="relative size-10 items-center justify-center overflow-hidden rounded-full bg-gray-800 p-1">
          <Image
            className={StyleHelper.mergeStyles('size-full rounded-full', { 'opacity-0': isLoading })}
            source={imageSource}
            onLoadEnd={() => setIsLoading(false)}
            onError={handleError}
            contentFit="contain"
          />

          {isLoading && <Loader className="size-6" containerClassName="absolute" />}
        </View>
      }
      label={
        <View>
          {session.expiry && (
            <Text className="font-sans-regular text-xs text-gray-300">
              {DateHelper.formatLocalized(new Date(session.expiry * 1000), { format: 'PP, p', language })}
            </Text>
          )}

          <Text className="font-sans-medium text-lg text-white" numberOfLines={1} ellipsizeMode="tail">
            {session.peer.metadata.name}
          </Text>

          {wallet && account && (
            <View className="flex-row items-center">
              <Text className="font-sans-regular text-xs text-gray-300">{`${wallet.name} - `}</Text>

              {account.skin.type === 'color' && (
                <View
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: account.skin.id,
                  }}
                />
              )}

              <Text className="font-sans-regular text-xs text-gray-300">{` ${account.name}`}</Text>
            </View>
          )}
        </View>
      }
    />
  )
}
