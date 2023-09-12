import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import SortableList from 'react-native-sortable-list'
import { useDispatch, useSelector } from 'react-redux'

import { Await, AwaitActivity } from '~/node_modules/@simpli/react-native-await'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { DataByNumber, RowProps } from '~/src/types/global'
import SwiperPanel, { LabelButton, useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
}

const ItemComponent = (props: RowProps<string>) => {
  return (
    <LinearLayout>
      <LinearLayout orientation="horiz" alignItems="center" mb="16px" mt="24px">
        <TextView color="text.0" fontSize={18}>
          {props.data}
        </TextView>
        <LinearLayout flex={1} />
        <ImageView source={require('~src/assets/images/icon-stack-green.png')} />
      </LinearLayout>
      <LinearLayout height={0.5} bg="background.10" alignSelf="stretch" />
    </LinearLayout>
  )
}

export default function ReorderWalletModal(props: Props) {
  const controller = useSwiperController(true)
  const wallets = useSelector(selectWallets)
  const dispatch = useDispatch()

  const [order, setOrder] = useState<number[]>([])

  const data = useMemo<DataByNumber<string>>(() => wallets.map(wallet => wallet.name), [wallets])

  const commitAndClose = async () => {
    if (order.length > 0) {
      dispatch(walletReducerActions.reorder(order))
    }

    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.reorderWallet.title')}
      onClose={props.navigation.goBack}
      withoutScrollView
      leftButton={<LabelButton label={i18n.t('modals.reorderWallet.cancel')} onPress={controller.close} />}
      rightButton={
        <LabelButton label={i18n.t('modals.reorderWallet.save')} onPress={() => Await.run('save', commitAndClose)} />
      }
    >
      <AwaitActivity name="save" loadingView={<ScreenLoader solidColorBG />}>
        <TextView textAlign="center" fontFamily="medium" fontSize={18} mb="18px" color="text.0">
          {i18n.t('modals.reorderWallet.subtitle')}
        </TextView>

        <SortableList
          style={{ flexGrow: 1, flexShrink: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderRow={ItemComponent}
          onChangeOrder={setOrder}
        />
      </AwaitActivity>
    </SwiperPanel>
  )
}
