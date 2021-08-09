import {RouteProp} from '@react-navigation/native'
import React, {useState} from 'react'
import {Alert, TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore, RootState} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

type ParamList = ModalStackParamList & RootStackParamList & WalletStackParamList

export interface EditAccountModalParam {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'EditAccountModal'>
}

const EditAccountModal = (props: Props) => {
  const tokenAssets = props.route.params.account.tokenAssets
  const account = Facade.utils.clone(props.route.params.account)
  account.tokenAssets = tokenAssets
  var isDeleted: boolean = false

  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [name, setName] = useState<string>(account.name ?? '')
  const [color, setColor] = useState<string>(account.backgroundColor)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  account.backgroundColor = color
  account.name = name

  const submit = async () => {
    if (!isValid()) return
    const address = account.address

    if (!address) throw new Error('Address not defined')

    dispatch(RootStore.account.actions.setName(name))
    dispatch(RootStore.account.actions.setBackgroundColor(color))

    await dispatchAsync(RootStore.account.actions.updateAndSave(address))
    await dispatchAsync(RootStore.app.actions.syncAccounts())

    dispatch(RootStore.account.actions.selectAccount(address))
    dispatch(RootStore.wallet.actions.selectWallet(account.idWallet))

    controller.close()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name, !!color, !!account.address]

    return conditions.every((it) => it)
  }

  const save = () => {
    if (!isValid()) {
      setShowInvalid(true)
      return
    }

    Facade.await.run('swiperRight', submit, 300)
  }

  const handleNavigation = () => {
    if (isDeleted) {
      props.navigation.reset({
        index: 0,
        routes: [{name: Facade.route.Tab.name}],
      })
      props.navigation.replace(Facade.route.ListWalletsPage.name, {})
      props.navigation.navigate(Facade.route.GetWallet.name, {})
    } else {
      props.navigation.goBack()
    }
  }

  const deleteAction = async () => {
    if (account?.address) {
      await dispatchAsync(RootStore.account.actions.delete(account.address))
    }

    await dispatchAsync(RootStore.app.actions.syncAccounts())

    isDeleted = true
    handleNavigation()
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      Facade.t('modals.editAccount.deleteAccountAlert'),
      [
        {
          text: Facade.t('modals.editAccount.navigation.cancel'),
          style: 'cancel',
        },
        {
          text: Facade.t('modals.editAccount.navigation.delete'),
          onPress: deleteAction,
        },
      ],
      {cancelable: true}
    )
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={0}
      title={Facade.t('modals.editAccount.title')}
      leftButton={Facade.t('modals.editAccount.navigation.cancel')}
      rightButton={Facade.t('modals.editAccount.navigation.save')}
      disableRightButton={!name}
      onLeftPress={() => controller.close()}
      onRightPress={save}
      onClose={() => handleNavigation()}
      solidColorBG={true}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader solidColorBG={true} />}
      >
        <LinearLayout
          orientation="verti"
          justifyContent="space-between"
          mt="10px"
        >
          <AccountCard
            account={account}
            isStackMode={false}
            hasShadow={false}
          />

          <InputLabel
            title={Facade.t('modals.editAccount.accountInput.title')}
            capitalize={true}
            marginTop="20px"
            marginBottom="5px"
          />
          <InputWithValidation
            value={name}
            validator={(text) => !(showInvalid && !text)}
            placeholder={Facade.t(
              'modals.editAccount.accountInput.placeholder'
            )}
            onChangeText={setName}
            onClearPress={() => setName('')}
            onFocus={() => setShowInvalid(false)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.quinary}
            invalidMessageColor={theme.colors.quinary}
            hidePaste={true}
            hideScan={true}
            sideMargins={0}
          />

          <InputLabel
            title={Facade.t('modals.editAccount.selectColor')}
            capitalize={true}
            marginBottom="13px"
          />

          <ColorSelector onSelect={setColor} account={account} />
          <LinearLayout>
            <InputLabel
              title={Facade.t('modals.editAccount.deleteAccount')}
              capitalize={true}
              marginBottom={'5px'}
              marginTop={'27px'}
            />
            <TextView color={theme.colors.text[0]} marginBottom={'20px'}>
              {Facade.t('modals.editAccount.deleteAccountSubtitle')}
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
                  {Facade.t('modals.editAccount.deleteButtom')}
                </TextView>
              </LinearLayout>
            </TouchableWithoutFeedback>
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default EditAccountModal
