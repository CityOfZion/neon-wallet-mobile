import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import SortableList from 'react-native-sortable-list'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {mockWalletItems} from '~src/mocks/mockWalletItems'
import {WalletMock} from '~src/models/WalletMock'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
}

export default function ReoderWalletModal(props: Props) {
  const controller = useSwiperController(true)

  const [wallets, setWallets] = useState(mockWalletItems)
  const [order, setOrder] = useState<number[]>([])
  const listData: DataByNumber<string> = {}

  wallets.forEach((wallet, index) => {
    listData[index] = wallet.title
  })

  function _renderItem(props: RowProps<string>) {
    return (
      <LinearLayout>
        <LinearLayout
          orientation="horiz"
          alignItems="center"
          mb="16px"
          mt="24px"
        >
          <TextView color="text.0" fontSize={18} fontFamily="bold">
            {props.data}
          </TextView>
          <LinearLayout flex={1} />
          <ImageView
            source={require('~src/assets/images/icon-stack-green.png')}
          />
        </LinearLayout>
        <LinearLayout height={0.5} bg="background.10" alignSelf="stretch" />
      </LinearLayout>
    )
  }

  function commitAndClose() {
    const newWalletList: WalletMock[] = []
    order.forEach((i) => newWalletList.push(wallets[i]))

    // Here is where it would save the order onto local store
    console.log(
      `TODO: Order list = ${newWalletList.map((w) => w.title).join(', ')}`
    )

    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.reorderWallet.title')}
      image={require('~src/assets/images/icon-swap-white.png')}
      fullSize={true}
      padding={24}
      onClose={props.navigation.goBack}
      leftButton={Facade.t('modals.reorderWallet.cancel')}
      rightButton={
        <TextView color="primary" fontSize={16} fontFamily="regular">
          {Facade.t('modals.reorderWallet.save')}
        </TextView>
      }
      onLeftPress={controller.close}
      onRightPress={commitAndClose}
    >
      <LinearLayout height="100%">
        <TextView
          textAlign="center"
          fontFamily="medium"
          fontSize={18}
          color="text.0"
        >
          {Facade.t('modals.reorderWallet.subtitle')}
        </TextView>
        <SortableList
          contentContainerStyle={{
            height: '100%',
            paddingTop: 26,
          }}
          data={listData}
          renderRow={_renderItem}
          onChangeOrder={(order) => setOrder(order)}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}
