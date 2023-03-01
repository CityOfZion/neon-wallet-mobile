import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey } from '~/src/blockchain'
import MenuItem, { RightIconType } from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { SettingsStackParamList } from '~/src/navigation/SettingsStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { RootState } from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList & SettingsStackParamList>
  route: RouteProp<SettingsStackParamList, 'ProtocolsPage'>
}

export const ProtocolsPage = (props: Props) => {
  const networks = useSelector((state: RootState) => state.settings.blockchainNetworks)
  const selectedNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const handlePress = (blockchain: BlockchainServiceKey) => {
    props.navigation.navigate(wrapper.route.ProtocolEditPage.name, { blockchain })
  }

  return (
    <ScreenLayout padding={20} darkerSolidColorBG scrollable={false}>
      <FlatList
        data={Object.keys(networks) as BlockchainServiceKey[]}
        renderItem={({ item }) => (
          <MenuItem
            icon={BlockchainHelper.getIcon(item)}
            iconWidth={22}
            iconMarginLeft={2}
            iconMarginRight={16}
            title={i18n.t(`screens.protocolsPage.labels.${item}`)}
            subtitle={UtilsHelper.capitalize(selectedNetworks[item].name)}
            arrowDirection={RightIconType.ARROW_RIGHT}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </ScreenLayout>
  )
}
