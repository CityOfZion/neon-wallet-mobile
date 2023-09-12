import { NftResponse } from '@cityofzion/blockchain-service'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Dimensions, TouchableWithoutFeedback } from 'react-native'
import { SvgUri } from 'react-native-svg'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { useImageError } from '~/src/hooks/useImageError'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  nft: NftResponse
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
}

export const NFTItem = React.memo(({ nft, navigation }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { imageSource, handleError, isDefault } = useImageError({
    source: { uri: nft.image },
    defaultSource: require('~/src/assets/images/diamond-green.png'),
  })
  function handleOnPressButtonDora() {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WebViewModal.name,
      params: {
        uri: `https://dora.coz.io/nft/neo3/mainnet/${nft.contractHash}/${nft.id}`,
        title: 'Dora | NFT Information',
      },
    })
  }

  return (
    <LinearLayout
      orientation="horiz"
      pt="8px"
      pb="8px"
      pl="8px"
      pr="8px"
      mb="8px"
      backgroundColor={theme.colors.background[8]}
      borderRadius="8px"
      alignItems="center"
    >
      <LinearLayout
        width="49px"
        height="49px"
        overflow="hidden"
        borderRadius="4px"
        backgroundColor={theme.colors.background[21]}
        alignItems="center"
        justifyContent="center"
      >
        {nft.isSVG && nft.image ? (
          <SvgUri
            width={Dimensions.get('screen').width * 0.2}
            height={Dimensions.get('screen').height * 0.2}
            uri={nft.image}
          />
        ) : (
          <ImageView
            resizeMode="cover"
            alignSelf="center"
            source={imageSource}
            onError={handleError}
            style={{
              width: !isDefault ? '100%' : '60%',
              height: !isDefault ? '100%' : '60%',
            }}
          />
        )}
      </LinearLayout>

      <LinearLayout ml="18px" mr="18px" flex={1}>
        <LinearLayout orientation="horiz">
          <LinearLayout
            width="16px"
            height="16px"
            overflow="hidden"
            borderRadius="8px"
            backgroundColor={theme.colors.background[21]}
            alignItems="center"
            justifyContent="center"
          >
            <ImageView
              resizeMode="cover"
              alignSelf="center"
              source={{
                uri: nft.collectionImage,
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </LinearLayout>

          <LinearLayout ml="4px" maxWidth="100px">
            <TextView
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.text[6]}
              fontFamily="medium"
              fontSize="12px"
            >
              {nft.collectionName}
            </TextView>
          </LinearLayout>

          <LinearLayout flex={1} ml="8px">
            <TextView ellipsizeMode="middle" numberOfLines={1} color="primary" fontFamily="medium" fontSize="12px">
              {`#${nft.id}`}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        <TextView numberOfLines={1} color={theme.colors.text[0]} fontFamily="medium" fontSize="18px">
          {nft.name}
        </TextView>
      </LinearLayout>

      <TouchableWithoutFeedback onPress={handleOnPressButtonDora}>
        <ImageView
          resizeMode="contain"
          alignSelf="center"
          source={require('~src/assets/images/dora-link.png')}
          style={{
            width: 28,
            height: 28,
          }}
        />
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
})
