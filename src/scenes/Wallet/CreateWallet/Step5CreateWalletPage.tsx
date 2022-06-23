import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { TextView, LinearLayout, ImageView } from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList & WalletStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'Step5CreateWallet'>
}

const Step5CreateWalletPage = (props: Props) => {
  return (
    <ScreenLayout alignX="center">
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width="100%">
          <LinearLayout alignItems="center">
            <ImageView
              mt={6}
              mb={4}
              source={require('~/src/assets/images/logo-3d.png')}
              style={{ marginLeft: Normalize.scale(60) }}
            />
          </LinearLayout>

          <TextView mb={5} color="text.0" fontSize="2xl" textAlign="center" lineHeight={Normalize.scale(24)}>
            {i18n.t('step5CreateWallet.label_1')}
          </TextView>

          <TextView color="text.0" fontSize="lg" textAlign="center" lineHeight={Normalize.scale(20)} fontFamily="light">
            {i18n.t('step5CreateWallet.body_1')}
          </TextView>

          <TextView color="text.0" fontSize="lg" textAlign="center" fontFamily="light" lineHeight={Normalize.scale(20)}>
            {i18n.t('step5CreateWallet.body_2')}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={7} px={5} width="100%">
        <ThemedButton
          onPress={() => {
            props.navigation.replace(wrapper.route.Tab.name, {
              screen: wrapper.route.ListWallets.name,
            })
            props.navigation.navigate(wrapper.route.ListWalletsPage.name)
          }}
          label={i18n.t('step5CreateWallet.viewWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step5CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step5CreateWalletPage
