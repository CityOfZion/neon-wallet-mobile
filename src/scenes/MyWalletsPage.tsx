import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Wallet} from '~src/models/redux/Wallet'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'

interface Props {
  navigation: StackNavigationProp<SettingsStackParamList>
  theme: DefaultTheme
}

const MyWalletsPage = (props: Props) => {
  const wallets = useSelector((state: RootState) => state.app.wallets)

  const _menuItem = (wallet: Wallet) => {
    return (
      <MenuItem
        title={wallet.name ?? '?'}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(Facade.route.MyWalletOptions.name, {
            wallet,
          })
        }
      />
    )
  }

  return (
    <ScreenLayout padding={20}>
      {wallets.map((it) => _menuItem(it))}
    </ScreenLayout>
  )
}

MyWalletsPage.propTypes = {
  navigation: PropTypes.func,
}

export default MyWalletsPage
