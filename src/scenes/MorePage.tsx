import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {DefaultTheme} from 'styled-components'

import {$} from '~/facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'

interface MoreProps {
  navigation: StackNavigationProp<MoreStackParamList>
  theme: DefaultTheme
  navigationOptions: object
}

const MorePage = (props: MoreProps) => {
  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={'Create wallet'}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() => {
          props.navigation.navigate($.path.Step1CreateWallet.name)
        }}
      />

      <MenuItem
        title={'Create watch account'}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={'Import'}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={'Help'}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={'Sample custom card color'}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate($.path.CustomColor.name)
        }}
      />

      <MenuItem
        title={'Sample modal'}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate('Modal', {screen: 'SampleModal'})
        }}
      />
    </ScreenLayout>
  )
}

export default MorePage
