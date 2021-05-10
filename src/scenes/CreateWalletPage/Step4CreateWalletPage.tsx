import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Alert} from 'react-native'
import {useDispatch} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedInputText from '~src/components/themed/ThemedInputText'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step4CreateWalletPage: React.FC<Props> = (props) => {
  const [walletName, setWalletName] = useState<string>()

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const submit = async () => {
    if (!walletName) {
      Alert.alert(Facade.t('step4CreateWallet.setName'))
      return
    }

    dispatch(RootStore.wallet.actions.setName(walletName))
    dispatch(RootStore.wallet.actions.setType('standard'))

    const id = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )
    dispatch(RootStore.wallet.actions.setShowBackupAlert(id, true))
    await dispatchAsync(RootStore.app.actions.syncWallets())

    // Create first Account automatically
    dispatch(RootStore.account.actions.clearState())

    dispatch(RootStore.account.actions.setIdWallet(id))
    dispatch(RootStore.account.actions.setName('My account 1'))

    await dispatchAsyncString(RootStore.account.actions.createAndSave())
    await dispatchAsync(RootStore.app.actions.syncAccounts())

    dispatch(RootStore.wallet.actions.clearState())
    dispatch(RootStore.account.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.selectWallet(id))

    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: Facade.route.Step5CreateWallet.name,
        },
      ],
    })
  }

  const isValid = () => {
    const conditions = [Boolean(walletName)]

    return conditions.every((it) => it)
  }

  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={'15px'} weight={1} mr={'5px'} ml={'5px'}>
        <LinearLayout mb={'15px'} width={'100%'}>
          <LinearLayout width={'100%'} orientation={'horiz'}>
            <TextView
              weight={1}
              color={'text.0'}
              fontSize={'lg'}
              fontFamily={'bold'}
              mb={4}
            >
              {Facade.t('step4CreateWallet.label_1')}
            </TextView>

            <TextView color={'text.0'} fontSize={'lg'} fontFamily={'bold'}>
              {Facade.t('step4CreateWallet.threeOfThree')}
            </TextView>
          </LinearLayout>

          <TextView mb={'25px'} color={'text.0'} fontSize={'lg'}>
            {Facade.t('step4CreateWallet.body_1')}
          </TextView>

          <ThemedInputText
            label={Facade.t('step4CreateWallet.label_walletName')}
            placeholder={Facade.t('step4CreateWallet.placeholder_walletName')}
            onChangeText={(value: string) => setWalletName(value)}
            value={walletName}
            maxLength={32}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={7} px={5} width={'100%'}>
        <AwaitActivity name={'submit'} size={'large'}>
          <ThemedButton
            onPress={() => Facade.await.run('submit', submit, 1000)}
            label={Facade.t('app.continue')}
          />
        </AwaitActivity>
      </LinearLayout>
    </ScreenLayout>
  )
}

Step4CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step4CreateWalletPage
