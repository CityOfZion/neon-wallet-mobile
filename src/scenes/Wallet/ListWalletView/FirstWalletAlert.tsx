import i18n from 'i18n-js'
import React from 'react'
import { Dimensions } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, ButtonWithoutFeedbackView, ImageView, TextView } from '~/src/styles/styled-components'

interface Props {
  onPress: () => void
}

export const FirstWalletAlert = ({ onPress }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <LinearLayout
      backgroundColor={`${theme.colors.black}A6`}
      zIndex={1}
      position="absolute"
      left="50%"
      top="50%"
      width={180}
      height={180}
      borderRadius="14px"
      style={{
        transform: [{ translateX: -90 }, { translateY: -90 }],
      }}
    >
      <ButtonWithoutFeedbackView onPress={onPress}>
        <LinearLayout height="100%" alignItems="center" justifyContent="space-evenly" p={Dimensions.get('screen').width * 0.02}>
          <ImageView
            source={require('~src/assets/images/icon-circle-arrow-curve-down-green.png')}
            resizeMode="contain"
            style={{
              width: 64,
              height: 64,
            }}
          />
          <TextView textAlign="center" fontFamily="medium" fontSize={20} color="primary">
            {i18n.t('screens.listWallets.isFirstWallet.title')}
          </TextView>
          <TextView color="text.0" fontSize={17} textAlign="center">
            {i18n.t('screens.listWallets.isFirstWallet.subtitle')}
          </TextView>
        </LinearLayout>
      </ButtonWithoutFeedbackView>
    </LinearLayout>
  )
}
