import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { Await, AwaitActivity } from '~/node_modules/@simpli/react-native-await'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { Account } from '~src/models/redux/Account'
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

  const [name, setName] = useState<string>(account.name ?? '')
  const [color, setColor] = useState<string>(account.backgroundColor)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  account.backgroundColor = color
  account.name = name

  const submit = async () => {
    if (!isValid()) return
    const address = account.address

    if (!address) throw new Error('Address not defined')

    account.name = name
    account.backgroundColor = color

    dispatch(accountReducerActions.saveAccount(account))

    props.navigation.goBack()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name, !!color, !!account.address]

    return conditions.every(it => it)
  }

  const save = () => {
    if (!isValid()) {
      setShowInvalid(true)
      return
    }

    Await.run('swiperRight', submit, 300)
  }

  const handleOnClose = () => {
    props.navigation.goBack()
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      paddingTop={0}
      title={i18n.t('modals.editAccount.title')}
      leftButton={i18n.t('modals.editAccount.navigation.cancel')}
      rightButton={i18n.t('modals.editAccount.navigation.save')}
      disableRightButton={!name}
      onLeftPress={() => controller.close()}
      onRightPress={save}
      onClose={handleOnClose}
      solidColorBG
    >
      <AwaitActivity name="swiperRight" loadingView={<ScreenLoader solidColorBG />}>
        <LinearLayout orientation="verti" justifyContent="space-between" mt="10px">
          <AccountCard account={account} isStack={false} hideBalance={false} />

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
