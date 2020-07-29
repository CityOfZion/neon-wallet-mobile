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
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

export default function CreateAccountModal(props: Props) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const currency = useSelector((state: RootState) => state.settings.currency)
  const controller = useSwiperController(true)
  const dispatch = useDispatch()

  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>(theme.colors.card[0])
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  const account = new Account()
  account.backgroundColor = color
  account.name = name

  const submit = async () => {
    dispatch(RootStore.account.actions.setName(name))
    dispatch(RootStore.account.actions.setCurrency(currency))
    if (color) dispatch(RootStore.account.actions.setBackgroundColor(color))

    await dispatch(RootStore.account.actions.createAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())

    dispatch(RootStore.account.actions.clearState())

    controller.close()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name]

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
      title={Facade.t('modals.createAccount.title')}
      leftButton={Facade.t('modals.createAccount.navigation.cancel')}
      rightButton={Facade.t('modals.createAccount.navigation.save')}
      onLeftPress={() => controller.close()}
      onRightPress={save}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/icon-plus-circle-white.png')}
    >
      <AwaitActivity name={'swiperRight'}>
        <LinearLayout width="100%" height="100%">
          <TextView
            mb="32px"
            color={theme.colors.text[0]}
            fontSize={18}
            fontFamily="medium"
            textAlign="center"
          >
            {Facade.t('modals.createAccount.subtitle')}
          </TextView>
          <InputLabel
            title={Facade.t('modals.createAccount.preview')}
            capitalize={true}
            marginBottom="24px"
          />

          <AccountCard account={account} isStackMode={false} />

          <InputLabel
            title={Facade.t('modals.createAccount.accountInput.title')}
            capitalize={true}
            marginTop="48px"
            marginBottom="10px"
          />
          <InputWithValidation
            value={name}
            validator={(text) => !(showInvalid && !text)}
            placeholder={Facade.t('modals.createAccount.accountInput.title')}
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
            title={Facade.t('modals.createAccount.selectColor')}
            capitalize={true}
            marginTop="12px"
            marginBottom="24px"
          />

          <ColorSelector onSelect={setColor} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
