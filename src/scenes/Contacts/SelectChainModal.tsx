import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import ListSeparator from '../walletConnect/components/ListSeparator'

import { BlockchainIcon } from '~/src/components/BlockchainIcon'
import { RootState } from '~/src/store/RootStore'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SelectChainModalParams {
  onSelect?: (blockchain: TBlockchainServiceKey) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SelectChainModal'>
}

type ItemProps = {
  blockchain: TBlockchainServiceKey
  onPress: (blockchain: TBlockchainServiceKey) => void
}

const Item = React.memo(({ blockchain, onPress }: ItemProps) => {
  return (
    <ButtonView py="12px" onPress={() => onPress(blockchain)} orientation="horiz" alignItems="center">
      <BlockchainIcon blockchain={blockchain} width={32} height={32} mr="12px" />

      <LinearLayout>
        <TextView color="text.11" fontSize="12px" fontWeight={500}>
          {i18n.t(`blockchainServices.${blockchain}.label`)}
        </TextView>

        <TextView color="text.0" fontSize="18px" fontWeight={700}>
          {i18n.t(`blockchainServices.${blockchain}.id`)}
        </TextView>
      </LinearLayout>
    </ButtonView>
  )
})

export const SelectChainModal = (props: Props) => {
  const { onSelect } = props.route.params

  const blockchainServicesKeys = useSelector(
    (state: RootState) => Object.keys(state.blockchain.bsAggregator.blockchainServicesByName) as TBlockchainServiceKey[]
  )

  const controller = useSwiperController(true)

  const handleSelect = (blockchain: TBlockchainServiceKey) => {
    controller.close()
    if (onSelect) onSelect(blockchain)
  }

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t(`modals.selectChainModal.title`)}
      onClose={props.navigation.goBack}
      withoutScrollView
    >
      <FlatList
        data={blockchainServicesKeys}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={item => item}
        renderItem={({ item }) => <Item onPress={handleSelect} blockchain={item} />}
      />
    </SwiperPanel>
  )
}
