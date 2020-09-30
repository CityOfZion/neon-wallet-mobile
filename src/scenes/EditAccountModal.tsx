import {RouteProp} from '@react-navigation/native'
import React, {useState} from 'react'
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
import {RootStore, RootState} from '~src/store/RootStore'
import {LinearLayout} from '~src/styles/styled-components'

type ParamList = ModalStackParamList & RootStackParamList

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

    dispatch(RootStore.account.actions.clearState())

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

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={36}
      paddingBottom={36}
      title={Facade.t('modals.editAccount.title')}
      leftButton={Facade.t('modals.editAccount.navigation.cancel')}
      rightButton={Facade.t('modals.editAccount.navigation.save')}
      onLeftPress={() => controller.close()}
      onRightPress={save}
      onClose={() => props.navigation.goBack()}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout width="100%" height="100%">
          <InputLabel
            title={Facade.t('modals.editAccount.preview')}
            capitalize={true}
            marginBottom="24px"
          />

          <AccountCard account={account} isStackMode={false} />

          <InputLabel
            title={Facade.t('modals.editAccount.accountInput.title')}
            capitalize={true}
            marginTop="48px"
            marginBottom="10px"
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
            marginTop="12px"
            marginBottom="24px"
          />

          <ColorSelector onSelect={setColor} account={account} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default EditAccountModal
