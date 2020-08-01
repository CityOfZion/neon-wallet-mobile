import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {Sync} from '~src/app/Sync'
import LoadingOverlay from '~src/components/LoadingOverlay'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import LoginStackNavigation from '~src/navigation/LoginStackNavigation'
import ModalStackNavigation, {
  ModalParams,
} from '~src/navigation/ModalStackNavigation'
import TabNavigation, {TabParams} from '~src/navigation/TabNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import QRCodeScan from '~src/scenes/QRCodeScan'
import {RootStore} from '~src/store/RootStore'

export type RootStackParamList = {
  Tab: TabParams
  Modal: ModalParams
  Login: undefined
  Onboarding: undefined
  QRCodeScan: undefined
}

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = (props: Props) => {
  const theme = useSelector((state: RootState) => {
    return Facade.theme[state.settings.theme]
  })
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState

  const [onboardingSeen, setOnboardingSeen] = useState(true)
  const [welcomeHidden, setWelcomeHidden] = useState(true)

  const dispatch = useDispatch<SyncDispatch>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const startApplication = async () => {
    const onboardingSeen = await Storage.onboardingSeen.load()
    const welcomeHidden = await Storage.welcomeHidden.load()

    setOnboardingSeen(onboardingSeen ?? false)
    setWelcomeHidden(welcomeHidden ?? false)

    // Synchronize app reducer
    const result = await Sync.init(dispatchAsync)

    if (result.wallets.length === 0) {
      // NW-221 The app must create a wallet for the user when it first runs
      await createFirstWallet()
    }
  }

  const createFirstWallet = async () => {
    const words = Facade.asteroid.generateMnemonic() ?? []

    dispatch(RootStore.wallet.actions.clearState())

    dispatch(RootStore.wallet.actions.setName('My First Wallet'))
    dispatch(RootStore.wallet.actions.setType('standard'))
    dispatch(RootStore.wallet.actions.setSecurityPhrase(words.join(' ')))

    const id = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )
    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.clearState())

    await createFirstAccount(id)
  }

  const createFirstAccount = async (id: string) => {
    dispatch(RootStore.account.actions.clearState())

    dispatch(RootStore.account.actions.setIdWallet(id))
    dispatch(RootStore.account.actions.setName('My account 1'))

    await dispatchAsyncString(RootStore.account.actions.createAndSave())
    await dispatchAsync(RootStore.app.actions.syncAccounts())

    dispatch(RootStore.account.actions.clearState())
  }

  useEffect(() => {
    Facade.await.run('application', startApplication, 1000)
  }, [])

  return (
    <>
      <>
        <AwaitActivity name={'application'} loadingView={<ScreenLoader />}>
          <NavigationContainer>
            {isLoading && (
              <LoadingOverlay progress={progress} loadingText={loadingText} />
            )}
            <ThemeProvider theme={theme}>
              <RootStack.Navigator
                initialRouteName={
                  onboardingSeen
                    ? Facade.route.Login.name
                    : Facade.route.Onboarding.name
                }
                headerMode="none"
                screenOptions={Facade.config.screen}
              >
                <RootStack.Screen
                  name="Tab"
                  component={TabNavigation}
                  initialParams={{welcomeHidden}}
                />
                <RootStack.Screen
                  name={Facade.route.Onboarding.name}
                  component={OnboardingPage}
                />
                <RootStack.Screen
                  name={Facade.route.QRCodeScan.name}
                  component={QRCodeScan}
                />
                <RootStack.Screen
                  name={Facade.route.Login.name}
                  component={LoginStackNavigation}
                />
                <RootStack.Screen
                  name={Facade.route.Modal.name}
                  component={ModalStackNavigation}
                  initialParams={props.route?.params}
                />
              </RootStack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </AwaitActivity>
      </>
    </>
  )
}

export default AppNavigation
