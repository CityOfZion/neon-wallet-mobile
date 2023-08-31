import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainIcon } from '~/src/components/BlockchainIcon'
import MenuItem, { RightIconType } from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { SettingsStackParamList } from '~/src/navigation/SettingsStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import { RootState } from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList & SettingsStackParamList>
  route: RouteProp<SettingsStackParamList, 'ProtocolsPage'>
}

export const ProtocolsPage = (props: Props) => {
  const networks = useSelector((state: RootState) => state.settings.blockchainNetworks)
  const selectedNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const handlePress = (blockchain: TBlockchainServiceKey) => {
    props.navigation.navigate(wrapper.route.ProtocolEditPage.name, { blockchain })
  }

  return (
    <ScreenLayout withoutScrollView>
      <FlatList
        data={Object.keys(networks) as TBlockchainServiceKey[]}
        renderItem={({ item }) => (
          <MenuItem
            icon={<BlockchainIcon blockchain={item} width={22} height={22} ml="2px" mr="16px" />}
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
