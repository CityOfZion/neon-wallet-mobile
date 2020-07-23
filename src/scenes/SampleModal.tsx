import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import ColorSelector from '~src/components/ColorSelector'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {Currency} from '~src/enums/Currency'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

export default function SampleModal(props: Props) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const {idWallet} = useSelector((state: RootState) => state.account)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)

  const [color, setColor] = useState<string>()
  const controller = useSwiperController(true)

  const dispatch = useDispatch()

  const generateNeoAccount = () => {
    const wallet = Wallet.find(idWallet ?? '', walletsPool)
    return wallet?.generateNeoAccount() ?? null
  }

  const submit = async () => {
    const neoAccount = generateNeoAccount()

    if (!isValid() || !neoAccount) return

    // TODO: Input values in fields
    dispatch(RootStore.account.actions.setName('TODO: Set name'))
    dispatch(RootStore.account.actions.setBalance(0))
    dispatch(RootStore.account.actions.setCurrency(Currency.USD))
    dispatch(RootStore.account.actions.setAddress(neoAccount.address))
    if (color) dispatch(RootStore.account.actions.setBackgroundColor(color))

    await dispatch(RootStore.account.actions.createAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())

    controller.close()
  }

  const isValid = () => {
    const conditions: boolean[] = [
      // TODO: Validate account fields
      true,
    ]

    return conditions.every((it) => it)
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={36}
      title={Facade.t('screens.createAccount.title')}
      leftButton={Facade.t('screens.createAccount.navigation.cancel')}
      rightButton={Facade.t('screens.createAccount.navigation.save')}
      onLeftPress={() => controller.close()}
      onRightPress={() => Facade.await.run('swiperRight', submit)}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/icon-plus-circle-white.png')}
    >
      <LinearLayout width="100%" height="100%">
        <TextView
          mb={52}
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {Facade.t('screens.createAccount.subtitle')}
        </TextView>
        <TextView color={theme.colors.text[0]} mb={66}>
          TODO: InputText {'\n'}
          {Facade.t('screens.createAccount.accountInput.title')} {'\n'}
          {Facade.t('screens.createAccount.accountInput.placeholder')} {'\n'}
        </TextView>
        <TextView
          mb={52}
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {Facade.t('screens.createAccount.selectColor')}
        </TextView>

        <ColorSelector onSelect={setColor} />
      </LinearLayout>
    </SwiperPanel>
  )
}
