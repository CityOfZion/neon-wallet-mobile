import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'

import ListSeparator from '../walletConnect/components/ListSeparator'

import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { BlockchainServiceKey } from '~src/blockchain'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SelectChainModalParams {
  onSelect?: (blockchain: BlockchainServiceKey) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SelectChainModal'>
}

type ItemProps = {
  blockchain: BlockchainServiceKey
  onPress: (blockchain: BlockchainServiceKey) => void
}

const Item = React.memo(({ blockchain, onPress }: ItemProps) => {
  return (
    <ButtonView py="12px" onPress={() => onPress(blockchain)} orientation="horiz" alignItems="center">
      <ImageView source={BlockchainHelper.getIcon(blockchain)} resizeMode="contain" mr="12px" width={32} height={32} />

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

  const controller = useSwiperController(true)
  const { blockchainKeyList } = useBlockchainServiceUtils()

  const handleSelect = (blockchain: BlockchainServiceKey) => {
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
        data={blockchainKeyList}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={item => item}
        renderItem={({ item }) => <Item onPress={handleSelect} blockchain={item} />}
      />
    </SwiperPanel>
  )
}
