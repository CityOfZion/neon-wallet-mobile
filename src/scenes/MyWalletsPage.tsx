import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {wrapper} from '~src/app/ApplicationWrapper'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Wallet} from '~src/models/redux/Wallet'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<SettingsStackParamList>
  theme: DefaultTheme
}

const MenuItemComponent = (props: {
  navigation: StackNavigationProp<SettingsStackParamList>
  wallet: Wallet
}) => {
  return (
    <MenuItem
      title={props.wallet.name ?? '?'}
      arrowDirection={RightIconType.ARROW_RIGHT}
      onPress={() =>
        props.navigation.navigate(wrapper.route.MyWalletOptions.name, {
          wallet: props.wallet,
        })
      }
    />
  )
}

const MyWalletsPage = (props: Props) => {
  const wallets = useSelector((state: RootState) => state.app.wallets)

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  return (
    <ScreenLayout padding={20}>
      {isListNotEmpty() ? (
        wallets.map((it, i) => (
          <MenuItemComponent
            key={i}
            navigation={props.navigation}
            wallet={it}
          />
        ))
      ) : (
        <LinearLayout alignItems={'center'} width={'100%'} height={'100%'}>
          <TextView
            color="white"
            fontSize={18}
            mt={9}
            fontFamily="medium"
            textAlign={'center'}
          >
            {i18n.t('myWalletsPage.noWallet')}
          </TextView>
          <TextView
            color="white"
            fontSize={18}
            fontFamily="medium"
            textAlign={'center'}
          >
            {i18n.t('myWalletsPage.noWallet_2')}
          </TextView>
        </LinearLayout>
      )}
    </ScreenLayout>
  )
}

MyWalletsPage.propTypes = {
  navigation: PropTypes.func,
}

export default MyWalletsPage
