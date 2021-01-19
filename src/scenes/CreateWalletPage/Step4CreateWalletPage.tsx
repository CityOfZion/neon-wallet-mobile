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
  const [passphrase, setPassphrase] = useState<string>()
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>()

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const submit = async () => {
    if (!walletName) {
      Alert.alert(Facade.t('step4CreateWallet.setName'))
      return
    } else if (!passphrase) {
      Alert.alert(Facade.t('step4CreateWallet.setPassphrase'))
      return
    } else if (passphrase !== confirmPassphrase) {
      Alert.alert(Facade.t('step4CreateWallet.passphraseDontMatch'))
      return
    }

    dispatch(RootStore.wallet.actions.setName(walletName))
    dispatch(RootStore.wallet.actions.setType('standard'))
    dispatch(RootStore.wallet.actions.setPassphrase(passphrase))

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
    const conditions = [
      Boolean(walletName),
      (passphrase?.length ?? 0) >= 6,
      passphrase === confirmPassphrase,
    ]

    return conditions.every((it) => it)
  }

  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width={'100%'}>
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

          <TextView mb={6} color={'text.0'} fontSize={'lg'}>
            {Facade.t('step4CreateWallet.body_1')}
          </TextView>

          <ThemedInputText
            mb={6}
            label={Facade.t('step4CreateWallet.label_walletName')}
            placeholder={Facade.t('step4CreateWallet.placeholder_walletName')}
            onChangeText={(value: string) => setWalletName(value)}
            value={walletName}
            maxLength={32}
          />

          <ThemedInputText
            mb={6}
            autoCompleteType={'password'}
            secureTextEntry={true}
            label={Facade.t('step4CreateWallet.label_createPassphrase')}
            placeholder={Facade.t(
              'step4CreateWallet.placeholder_createPassphrase'
            )}
            onChangeText={(value: string) => setPassphrase(value)}
            value={passphrase}
            maxLength={16}
          />

          <ThemedInputText
            autoCompleteType={'password'}
            secureTextEntry={true}
            label={Facade.t('step4CreateWallet.label_confirmPassphrase')}
            placeholder={Facade.t(
              'step4CreateWallet.placeholder_confirmPassphrase'
            )}
            onChangeText={(value: string) => setConfirmPassphrase(value)}
            value={confirmPassphrase}
            maxLength={16}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
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
