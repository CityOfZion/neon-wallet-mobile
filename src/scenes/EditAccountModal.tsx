import {RouteProp} from '@react-navigation/native'
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore, RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

type ParamList = ModalStackParamList & RootStackParamList

export interface EditAccountModalParam {
  account: Account
  onDelete?: () => void
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'EditAccountModal'>
}

const EditAccountModal = (props: Props) => {
  const {account, onDelete} = props.route.params

  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const currency = useSelector((state: RootState) => state.settings.currency)
  const controller = useSwiperController(true)
  const dispatch = useDispatch()

  const [name, setName] = useState<string>(account.name ?? '')
  const [color, setColor] = useState<string>(account.backgroundColor)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  account.backgroundColor = color
  account.name = name

  const submit = async () => {
    if (!isValid()) return

    dispatch(RootStore.account.actions.setName(name))
    dispatch(RootStore.account.actions.setAddress(account.address!))
    dispatch(RootStore.account.actions.setBackgroundColor(color))
    dispatch(RootStore.account.actions.setCurrency(currency))

    await dispatch(RootStore.account.actions.updateAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())

    controller.close()
  }

  const remove = async () => {
    if (!isValid()) return

    dispatch(RootStore.account.actions.setAddress(account.address!))

    await dispatch(RootStore.account.actions.deleteAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())

    // https://github.com/typescript-eslint/typescript-eslint/issues/1138
    // eslint-disable-next-line no-unused-expressions
    onDelete?.()
    controller.close()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name, !!color, !!account.address]

    return conditions.every((it) => it)
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
      onRightPress={() => Facade.await.run('swiperRight', submit)}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/icon-pencil-white.png')}
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
          placeholder={Facade.t('modals.editAccount.accountInput.placeholder')}
          onChangeText={setName}
          onClearPress={() => setName('')}
          onFocus={() => setShowInvalid(false)}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.background[3]}
          separatorColor={theme.colors.background[5]}
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

        <ColorSelector onSelect={setColor} />

        <RelativeLayout weight={1} width="100%" justifyContent="flex-end">
          <LinearLayout bg={'background.5'} width="100%" height="1px" my={32} />

          <InputLabel
            title={Facade.t('modals.editAccount.deleteAccount.title')}
            capitalize={true}
            marginTop="12px"
            marginBottom="24px"
          />
          <TextView
            color="text.0"
            fontSize="16px"
            fontFamily="regular"
            letterSpacing={0.59}
            mb="24px"
          >
            {Facade.t('modals.editAccount.deleteAccount.subtitle')}
          </TextView>

          <ThemedButton
            onPress={remove}
            label={Facade.t('modals.editAccount.deleteAccount.title')}
            srcIcon={require('~src/assets/images/icon-trash-can-primary.png')}
            iconSize={[16, 16]}
            flat={true}
            borderColor={theme.colors.primary}
            borderThickness="1px"
            fontFamily="regular"
          />
        </RelativeLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default EditAccountModal
