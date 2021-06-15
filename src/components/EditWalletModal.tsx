import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState} from 'react'
import {Alert, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {TabStackParamList} from '~/src/navigation/TabNavigation'
import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'

type ParamList = ModalStackParamList &
  TabStackParamList &
  SettingsStackParamList &
  WalletStackParamList

export interface EditWalletParams {
  wallet: Wallet
  fromWalletDetailsPage: boolean
}

interface EditWalletModalProps {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'EditWalletModal'>
}

export const EditWalletModal = (
  props: EditWalletModalProps & EditWalletParams
) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const wallet = props.route.params?.wallet
  var isDeleted: boolean = false
  var route: any

  const [name, setName] = useState(wallet?.name ?? '')
  const controller = useSwiperController(true)

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(Facade.t('modals.editWallet.invalidName'))
      return
    }

    dispatch(RootStore.wallet.actions.clearState())

    dispatch(RootStore.wallet.actions.setName(name))

    if (wallet?.id) {
      await dispatchAsync(RootStore.wallet.actions.update(wallet.id))
    } else {
      await dispatchAsync(RootStore.wallet.actions.createAndSave())
    }

    dispatch(RootStore.wallet.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncWallets())
    if (props.route.params?.fromWalletDetailsPage) {
      route = Facade.route.MyWallets.name
    } else {
      route = Facade.route.ListWalletsPage.name
    }
    props.navigation.navigate(route)
  }

  const deleteAction = async () => {
    dispatch(RootStore.wallet.actions.clearState())

    if (wallet?.id) {
      await dispatchAsync(RootStore.wallet.actions.delete(wallet.id))
    }
    dispatch(RootStore.wallet.actions.clearState())
    dispatch(RootStore.account.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncWallets())
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    await dispatchAsync(RootStore.app.actions.syncTokenAssets())
    dispatch(RootStore.wallet.actions.selectWallet(null))

    isDeleted = true
    handleNavigation()
  }

  const save = () => {
    Facade.await.run('swiperRight', submit, 300)
  }

  const handleNavigation = () => {
    var route: any
    if (isDeleted) {
      props.navigation.reset({
        index: 0,
        routes: [{name: Facade.route.ListWalletsPage.name}],
      })
      if (props.route.params?.fromWalletDetailsPage) {
        route = Facade.route.MyWallets.name
      } else {
        route = Facade.route.ListWalletsPage.name
      }
      props.navigation.navigate(route)
    } else {
      props.navigation.goBack()
    }
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      Facade.t('modals.editWallet.deleteWalletAlert'),
      [
        {
          text: Facade.t('modals.editWallet.navigation.cancel'),
          style: 'cancel',
        },
        {
          text: Facade.t('modals.editWallet.navigation.delete'),
          onPress: deleteAction,
        },
      ],
      {cancelable: true}
    )
  }

  const alertNoBackupDelete = () => {
    Alert.alert(
      '',
      Facade.t('modals.editWallet.deleteWalletNoBackupAlert'),
      [
        {
          text: Facade.t('modals.editWallet.navigation.ok'),
          style: 'cancel',
        },
      ],
      {cancelable: true}
    )
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      title={Facade.t('modals.editAccount.title')}
      rightButton={Facade.t('modals.editWallet.navigation.save')}
      leftButton={Facade.t('modals.editWallet.navigation.cancel')}
      imageSize={[22, 22]}
      onClose={handleNavigation}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
      solidColorBG={true}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader solidColorBG={true} />}
      >
        <LinearLayout
          height="100%"
          orientation="verti"
          justifyContent="space-between"
        >
          <LinearLayout>
            <InputLabel
              title={Facade.t('modals.editWallet.walletName')}
              marginBottom={'8px'}
            />

            <InputWithValidation
              placeholder={Facade.t('modals.editWallet.namePlaceholder')}
              onChangeText={(val) => setName(val)}
              color={'background.4'}
              value={name}
              validator={(val) =>
                (val.length >= 2 && val.length <= 20) || val?.length === 0
              }
              separatorColor={'background.3'}
              invalidColor={'background.3'}
              invalidMessageColor={'quinary'}
              sideMargins={0}
              hideScan={true}
              hidePaste={true}
            />
          </LinearLayout>
          <LinearLayout>
            <LinearLayout height="1px" bg={theme.colors.background[10]} />
            <InputLabel
              title={Facade.t('modals.editWallet.deleteWallet')}
              marginBottom={'8px'}
              marginTop={'30px'}
            />
            <TextView color={theme.colors.text[0]} marginBottom={'30px'}>
              {Facade.t('modals.editWallet.deleteWalletSubtitle')}
            </TextView>
            <TouchableWithoutFeedback onPress={alertDelete}>
              <LinearLayout
                width="100%"
                borderRadius="4px"
                borderWidth="1px"
                borderColor="primary"
                justifyContent="center"
                alignItems="center"
                orientation="horiz"
                p="10px"
              >
                <ImageView
                  resizeMode="center"
                  imageSize={[20, 20]}
                  source={require('~/src/assets/images/icon-trash-can-primary.png')}
                />

                <TextView
                  style={{includeFontPadding: false}}
                  ml={3}
                  color={'primary'}
                  fontSize={20}
                >
                  {Facade.t('modals.editWallet.deleteButtom')}
                </TextView>
              </LinearLayout>
            </TouchableWithoutFeedback>
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

// Style for "Rectangle"
const styles = StyleSheet.create({
  rectangle: {
    width: 350,
    height: 53,
    borderRadius: 4,
    borderColor: '#4cffb3',
    borderStyle: 'solid',
    borderWidth: 1,
  },
})

export default EditWalletModal
