import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { LinearLayout, ImageView, TextView, ButtonView } from '~/src/styles/styled-components'

export const EmptyList = () => {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.More.name,
      params: {
        screen: wrapper.route.Step1CreateWallet.name,
        initial: false,
        params: {
          source: wrapper.route.WalletContextModal.name,
        },
      },
    })
  }

  return (
    <LinearLayout alignItems="center" width="100%" height="100%" mt="14px">
      <ButtonView
        onPress={handlePress}
        width={280}
        height={386}
        orientation="horiz"
        alignItems="center"
        justifyContent="center"
        borderStyle="dashed"
        borderColor="text.0"
        borderRadius="18px"
        borderWidth="1px"
      >
        <ImageView source={require('~src/assets/images/icon-plus-white.png')} />

        <TextView color="text.0" fontSize="xl" ml="6px" fontFamily="medium">
          {i18n.t('screens.listWallets.createFirstWallet')}
        </TextView>
      </ButtonView>
    </LinearLayout>
  )
}
