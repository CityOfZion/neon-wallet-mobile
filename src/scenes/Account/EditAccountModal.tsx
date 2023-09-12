import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { Await, AwaitActivity } from '~/node_modules/@simpli/react-native-await'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { Account } from '~/src/store/account/Account'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { LabelButton, useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout } from '~src/styles/styled-components'

type ParamList = ModalStackParamList & RootStackParamList & WalletStackParamList

export interface EditAccountModalParam {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'EditAccountModal'>
}

const EditAccountModal = (props: Props) => {
  const account = props.route.params.account

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const controller = useSwiperController(true)
  const dispatch = useDispatch()

  const [name, setName] = useState<string>(account.name)
  const [color, setColor] = useState<string>(account.backgroundColor)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  const balanceExchange = useBalancesAndExchange(account)

  account.backgroundColor = color
  account.name = name

  const submit = async () => {
    if (!isValid()) return

    dispatch(accountReducerActions.saveAccount(account))

    props.navigation.goBack()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name, !!color]

    return conditions.every(it => it)
  }

  const save = () => {
    if (!name) return

    Await.run('save', submit, 300)
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.editAccount.title')}
      leftButton={<LabelButton label={i18n.t('modals.editAccount.navigation.cancel')} onPress={controller.close} />}
      rightButton={<LabelButton label={i18n.t('modals.editAccount.navigation.save')} disabled={!name} onPress={save} />}
      onClose={props.navigation.goBack}
    >
      <AwaitActivity name="save" loadingView={<ScreenLoader transparent />}>
        <LinearLayout orientation="verti" justifyContent="space-between" mt="10px">
          <AccountCard balanceExchange={balanceExchange} account={account} isStack={false} hideBalance={false} />

          <InputLabel
            title={i18n.t('modals.editAccount.accountInput.title')}
            capitalize
            marginTop="20px"
            marginBottom="5px"
          />
          <InputWithValidation
            value={name}
            validator={text => !(showInvalid && !text)}
            placeholder={i18n.t('modals.editAccount.accountInput.placeholder')}
            onChangeText={setName}
            onClearPress={() => setName('')}
            onFocus={() => setShowInvalid(false)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.quinary}
            invalidMessageColor={theme.colors.quinary}
            hidePaste
            hideScan
            sideMargins={0}
          />

          <InputLabel title={i18n.t('modals.editAccount.selectColor')} capitalize marginBottom="13px" />

          <ColorSelector onSelect={setColor} account={account} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default EditAccountModal
