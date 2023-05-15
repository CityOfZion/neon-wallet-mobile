import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey } from '~/src/blockchain'
import SelectorList, { SelectorItem } from '~/src/components/SelectorList'
import { Separator } from '~/src/components/Separator'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { blockchainConfig, TBlockchainNetwork } from '~/src/config/BlockchainConfig'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { SettingsStackParamList } from '~/src/navigation/SettingsStackNavigation'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { RootState } from '~src/store/RootStore'

export interface ProtocolEditPageParams {
  blockchain: BlockchainServiceKey
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<SettingsStackParamList, 'ProtocolEditPage'>
}

export const ProtocolEditPage = (props: Props) => {
  const { blockchain } = props.route.params

  const defaultNetworkType = blockchainConfig.defaultSelectedNetworks[blockchain].type
  const availableNetworks = blockchainConfig.availableNetworks[blockchain]

  const networks = useSelector((state: RootState) => state.settings.blockchainNetworks[blockchain])
  const selectedNetwork = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks[blockchain])
  const dispatch = useDispatch()
  const { sessions, disconnect } = useWalletConnectWallet()

  const handleClick = (value: TBlockchainNetwork) => {
    Promise.allSettled(sessions.map(session => disconnect(session)))

    dispatch(
      settingsReducerActions.setSelectNetwork({
        blockchain,
        id: value.id,
      })
    )
  }

  const handleAddCustomNetwork = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.EditNetworkModal.name,
      params: {
        blockchain,
      },
    })
  }

  const isSelected = (value: TBlockchainNetwork) => value.id === selectedNetwork.id

  const handleActionPress = async (value: TBlockchainNetwork) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.EditNetworkModal.name,
      params: {
        blockchain,
        network: value,
      },
    })
  }

  const selectorItems: SelectorItem<TBlockchainNetwork>[] = networks.map(network => ({
    data: network,
    onClick: handleClick,
    isSelected,
    title: UtilsHelper.capitalize(network.name),
    description: defaultNetworkType === network.type ? i18n.t('screens.protocolEditPage.default') : undefined,
    actionButtonImage: network.type === 'custom' ? require('~src/assets/images/icon-pencil-green.png') : undefined,
    onActionPress: handleActionPress,
  }))

  return (
    <ScreenLayout withoutScrollView title={i18n.t(`screens.protocolsPage.labels.${blockchain}`)}>
      <LinearLayout flexGrow={1}>
        <SelectorList items={selectorItems} />

        {availableNetworks.includes('custom') && (
          <>
            <Separator />
            <ButtonView orientation="horiz" paddingY="18px" onPress={handleAddCustomNetwork}>
              <ImageView
                width={20}
                height={20}
                resizeMode="contain"
                source={require('~src/assets/images/icon-unlink-green.png')}
              />
              <TextView marginX="12px" fontSize="18px" color="text.0" weight={1}>
                {i18n.t('screens.protocolEditPage.addLabel')}
              </TextView>
              <ImageView
                width={20}
                height={20}
                resizeMode="contain"
                source={require('~src/assets/images/green_plus.png')}
              />
            </ButtonView>
          </>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}
