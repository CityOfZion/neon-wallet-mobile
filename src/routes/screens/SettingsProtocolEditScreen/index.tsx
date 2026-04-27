import React, { Fragment } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAppDispatch } from '@/hooks/useRedux'
import { useCustomNetworksSelector, useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbCheck from '@/assets/images/tb-check.svg'
import TbCube3dSphere from '@/assets/images/tb-cube-3d-sphere.svg'
import TbPencil from '@/assets/images/tb-pencil.svg'
import TbPlus from '@/assets/images/tb-plus.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TMoreStackScreenProps } from '@/types/stacks'

type TItem = {
  blockchain: TBlockchainServiceKey
  network: TNetwork
  selectedNetwork: TNetwork
  isDefault?: boolean
  onPress(): void
}

const { t } = I18nextHelper.get()

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  const isSelected = item.network.id === item.selectedNetwork.id

  return (
    <TwMenuButton
      label={item.network.name}
      labelProps={{ className: 'capitalize' }}
      subtitle={item.isDefault ? t('screens:settingsProtocolEdit.default') : undefined}
      subtitleClassName="flex-grow"
      rightElement={isSelected ? <TbCheck aria-hidden className="size-6 text-neon" /> : undefined}
      onPress={item.onPress}
    />
  )
}

export const SettingsProtocolEditScreen = ({
  navigation,
  route,
}: TMoreStackScreenProps<'SettingsProtocolEditScreen'>) => {
  const { blockchain } = route.params

  const dispatch = useAppDispatch()
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)
  const { customNetworks } = useCustomNetworksSelector(blockchain)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const isSelectedNetworkCustom = selectedNetwork.type === 'custom'

  const handlePress = async (network: TNetwork) => {
    dispatch(
      settingsReducerActions.setSelectNetwork({
        blockchain,
        network,
      })
    )

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    if (!hasWalletConnect(service)) return

    const sessions = WalletKitHelper.kit.getActiveSessions()
    const accountSessions = WalletKitHelper.filterSessions(Object.values(sessions), {
      chains: [service.walletConnectService.chain],
    })

    await Promise.allSettled(
      accountSessions.map(session =>
        WalletKitHelper.kit.disconnectSession({
          topic: session.topic,
          reason: WalletKitHelper.getError('USER_DISCONNECTED'),
        })
      )
    )
  }

  const handleAddCustomNetwork = () => {
    navigation.navigate('PersistNetworkModal', {
      blockchain,
    })
  }

  const handleEditCustomNetwork = async () => {
    navigation.navigate('PersistNetworkModal', {
      blockchain,
      network: selectedNetwork,
    })
  }

  const handleSelectNetworkUrl = async () => {
    navigation.navigate('NetworkUrlSelectionModal', { blockchain })
  }

  const data = service.availableNetworks
    .concat(customNetworks)
    .map<TItem>(network => {
      return {
        blockchain,
        network,
        selectedNetwork,
        onPress: handlePress.bind(null, network),
        isDefault:
          network.id === service.defaultNetwork.id ||
          (service.availableNetworks.length <= 1 && !service.isCustomNetworkSupported),
      }
    })
    .sort(item => (item.isDefault ? -1 : 1))

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t(`common:blockchain.${blockchain}`)}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent>
        <FlatList data={data} renderItem={renderItem} ItemSeparatorComponent={TwSeparator} />

        <TwSeparator />

        <TwMenuButton
          label={t('screens:settingsProtocolEdit.selectNetworkUrlButtonLabel')}
          description={selectedNetwork.url}
          disabled={service.networkUrls.length <= 1}
          leftElement={<TbCube3dSphere aria-hidden />}
          onPress={handleSelectNetworkUrl}
        />

        {service.isCustomNetworkSupported && (
          <Fragment>
            <TwSeparator />

            <TwMenuButton
              label={
                isSelectedNetworkCustom
                  ? t('screens:settingsProtocolEdit.editCustomNetworkButtonLabel')
                  : t('screens:settingsProtocolEdit.addCustomNetworkButtonLabel')
              }
              leftElement={isSelectedNetworkCustom ? <TbPencil aria-hidden /> : <TbPlus aria-hidden />}
              onPress={isSelectedNetworkCustom ? handleEditCustomNetwork : handleAddCustomNetwork}
            />
          </Fragment>
        )}
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}
