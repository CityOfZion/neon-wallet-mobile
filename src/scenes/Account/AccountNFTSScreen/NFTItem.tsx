import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { NFTResponse } from '~/src/models/response/NFTResponse'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  nft: NFTResponse
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
}

export const NFTItem = React.memo(({ nft, navigation }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const [shouldShowDefaultNFTImage, setShouldShowDefaultNFTImage] = useState(false)

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
        <ImageView
          resizeMode="cover"
          alignSelf="center"
          source={
            !shouldShowDefaultNFTImage
              ? nft.image
                ? { uri: nft.image }
                : require('~/src/assets/images/diamond-green.png')
              : require('~/src/assets/images/diamond-green.png')
          }
          onError={error => {
            console.log(error.nativeEvent.error)
            setShouldShowDefaultNFTImage(true)
          }}
          style={{
            width: !shouldShowDefaultNFTImage ? '100%' : '60%',
            height: !shouldShowDefaultNFTImage ? '100%' : '60%',
          }}
        />
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
