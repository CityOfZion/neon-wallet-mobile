import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Wallet} from '~src/models/Wallet'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import ScreenLoader from '~src/components/loader/ScreenLoader'

interface Props {
  navigation: StackNavigationProp<SettingsStackParamList>
  theme: DefaultTheme
}

const MyWalletsPage = (props: Props) => {
  const [wallets, setWallets] = useState<Wallet[]>([])

  const populate = async () => {
    const wallets = await Storage.wallets.load()

    if (wallets) {
      setWallets(wallets)
    }
  }

  const _menuItem = (wallet: Wallet) => {
    return (
      <MenuItem
        title={wallet.name ?? '?'}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(Facade.route.MyWalletOptions.name, {
            wallet,
            headerTitle: wallet.name ?? '?',
          })
        }
      />
    )
  }

  return (
    <ScreenLayout
      onLayout={() => Facade.await.run('populate', populate)}
      padding={20}
    >
      <AwaitActivity
        name={'populate'}
        size={'large'}
        loadingView={<ScreenLoader />}
      >
        {wallets.map((it) => _menuItem(it))}
      </AwaitActivity>
    </ScreenLayout>
  )
}

MyWalletsPage.propTypes = {
  navigation: PropTypes.func,
}

export default MyWalletsPage
