import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {FlatList} from 'react-native'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {mockListTokenModal} from '~src/mocks/mockListTokenModal'
import {TokenValue} from '~src/models/TokenValue'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const ListTokenModal = (props: Props) => {
  const controller = useSwiperController(true)

  const Item = (item: TokenValue) => {
    return (
      <LinearLayout py="12px" orientation="horiz" alignItems="center">
        <ImageView
          height="29px"
          width="29px"
          alignSelf="center"
          mr="12px"
          source={item.srcIcon}
        />
        <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
          {item.symbol}
        </TextView>

        <LinearLayout orientation="vert" mr="15px">
          <TextView
            alignItems="flex-end"
            fontFamily="medium"
            fontSize="14px"
            color="text.2"
          >
            {Facade.t('modals.listTokenModal.holding')}
          </TextView>

          <TextView fontFamily="bold" fontSize="18px" color="text.0">
            {item.holding}
          </TextView>
        </LinearLayout>

        <ImageView source={require('~src/assets/images/green_plus.png')} />
      </LinearLayout>
    )
  }

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.listTokenModal.tokens')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      fullSize={true}
      image={require('~/src/assets/images/token_icon.png')}
      onClose={props.navigation.goBack}
    >
      <LinearLayout height="100%" px="16px">
        <TextView
          textAlign="center"
          fontFamily="medium"
          fontSize={18}
          mt="36px"
          color="text.0"
        >
          {Facade.t('modals.listTokenModal.selectToken')}
        </TextView>
        <FlatList
          contentContainerStyle={{
            height: '100%',
            paddingTop: 26,
          }}
          data={mockListTokenModal}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={() => <LinearLayout bg="text.3" height={1} />}
          renderItem={({item}) => (
            <Item
              srcIcon={item.srcIcon}
              value={item.value}
              color={null}
              symbol={item.symbol}
              name={item.name}
              holding={item.holding}
            />
          )}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ListTokenModal
