import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'

interface Props {
  route: RouteProp<SettingsStackParamList, 'MyWalletOptions'>
  navigation: StackNavigationProp<SettingsStackParamList>
  theme: DefaultTheme
}

const MyWalletOptionsPage = (props: Props) => {
  const {wallet} = props.route.params

  props.navigation.setOptions({
    headerTitle: () =>
      HeaderBar({
        title: wallet.name ?? '',
      }),
  })

  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={Facade.t('myWalletOptions.details')}
        icon={require('~src/assets/images/icon-details-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      {!(wallet.walletType === 'legacy' || wallet.walletType === 'watch') && (
        <MenuItem
          title={Facade.t('myWalletOptions.backupWallet')}
          icon={require('~src/assets/images/icon-screen-lock-green.png')}
          iconMarginLeft={2}
          iconMarginRight={5}
          arrowDirection={RightIconType.ARROW_RIGHT}
          onPress={() =>
            props.navigation.navigate(Facade.route.Step1BackupWallet.name, {
              wallet,
            })
          }
        />
      )}
    </ScreenLayout>
  )
}

export default MyWalletOptionsPage
