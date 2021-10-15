import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {Dimensions} from 'react-native'
import SortableList from 'react-native-sortable-list'
import {useDispatch, useSelector} from 'react-redux'

import {UtilsHelper} from '../helpers/UtilsHelper'

import {Await, AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {Sync} from '~src/app/Sync'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
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
        <ImageView
          source={require('~src/assets/images/icon-stack-green.png')}
        />
      </LinearLayout>
      <LinearLayout height={0.5} bg="background.10" alignSelf="stretch" />
    </LinearLayout>
  )
}

export default function ReorderWalletModal(props: Props) {
  const controller = useSwiperController(true)

  const {wallets} = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [order, setOrder] = useState<number[]>([])
  const listData: DataByNumber<string> = {}

  wallets.forEach((wallet, index) => {
    listData[index] = wallet.name ?? ''
  })

  const commitAndClose = async () => {
    if (order.length > 0) {
      Await.init('populateWallet')
      await dispatchAsync(RootStore.wallet.actions.reorderAndSave(order))
      await dispatchAsync(RootStore.app.actions.syncWallets())
      await dispatchAsync(RootStore.app.actions.syncTokenAssets())
      dispatch(RootStore.wallet.actions.selectWallet(null))
      await UtilsHelper.sleep(1000)
      Await.done('populateWallet')
    }

    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.reorderWallet.title')}
      fullSize={true}
      padding={24}
      onClose={props.navigation.goBack}
      leftButton={i18n.t('modals.reorderWallet.cancel')}
      rightButton={
        <ThemedButton
          label={i18n.t('modals.reorderWallet.save')}
          textColor={'primary'}
          fontSize={'16px'}
          rounded={false}
          flat={true}
        />
      }
      onLeftPress={controller.close}
      onRightPress={() => Await.run('commitAndClose', commitAndClose)}
      solidColorBG={true}
    >
      <AwaitActivity
        name={'commitAndClose'}
        loadingView={<ScreenLoader solidColorBG={true} />}
      >
        <LinearLayout height="100%" mt={Dimensions.get('screen').height * 0.02}>
          <TextView
            textAlign="center"
            fontFamily="medium"
            fontSize={18}
            color="text.0"
          >
            {i18n.t('modals.reorderWallet.subtitle')}
          </TextView>
          <SortableList
            contentContainerStyle={{
              height: '100%',
              paddingTop: Dimensions.get('screen').height * 0.07,
            }}
            data={listData}
            renderRow={ItemComponent}
            onChangeOrder={(order) => setOrder(order)}
          />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
