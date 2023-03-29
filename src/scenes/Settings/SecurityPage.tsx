import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import MenuItem, { RightIconType } from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { SettingsStackParamList } from '~/src/navigation/SettingsStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { TextView } from '~/src/styles/styled-components'
import { RootState } from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList & SettingsStackParamList>
  route: RouteProp<SettingsStackParamList, 'SecurityPage'>
}

export const SecurityPage = (props: Props) => {
  const { security } = useSelector((state: RootState) => state.settings)

  const handlePressAuthentication = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SecurityPickerModal.name,
    })
  }

  return (
    <ScreenLayout>
      <TextView fontFamily="regular" fontSize="lg" color="text.0" textAlign="center" mb="48px">
        {i18n.t('screens.securityPage.subtitle')}
      </TextView>

      <MenuItem
        title={i18n.t('screens.securityPage.authentication')}
        subtitle={security}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={handlePressAuthentication}
      />
    </ScreenLayout>
  )
}
