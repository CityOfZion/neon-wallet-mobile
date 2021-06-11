import {wallet} from '@cityofzion/neon-core'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState, useEffect} from 'react'
import {Alert, Platform, TextInput, Text} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {Account} from '../models/redux/Account'

import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {AsteroidHelper} from '~src/helpers/AsteroidHelper'
import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {getRandomColor} from '~src/scenes/CustomizeAccount'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, ImageView, TextView} from '~src/styles/styled-components'

interface ImportKeyProps {
  navigation: StackNavigationProp<MoreStackParamList & WalletStackParamList>
  route: RouteProp<MoreStackParamList, 'ImportKey'>
}

const validateMnemonic = (word: string) => {
  const list = String(word).split(' ')
  return list.length === 12
}

const isMnemonic = (word: string) => {
  return word.split(' ').length > 1
}

const validator = (text: string) =>
  wallet.isAddress(text) ||
  wallet.isNEP2(text) ||
  wallet.isWIF(text) ||
  !text ||
  validateMnemonic(text)

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const {isConnected} = useSelector((state: RootState) => state.network)
  const [inputValue, setInputValue] = useState(
    props.route.params ? props.route.params.key ?? '' : ''
  )
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const inputIsValid = validator(inputValue)

  const importMnemonic = async (mnemonic: string) => {
    const mnemonicIsImported = (await dispatchAsync(
      RootStore.wallet.actions.mnemonicIsImported(mnemonic)
    )) as boolean
    if (!mnemonicIsImported) {
      let index: number = 0
      let stop: boolean = false
      const WALLET_NAME_DEFAULT = 'Mnemonic Wallet'
      const ACCOUNT_NAME_DEFAULT = `Mnemonic Account ${index + 1}`
      const walletID = await createWallet(WALLET_NAME_DEFAULT, mnemonic)
      while (!stop && isConnected) {
        const {WIF, address} = AsteroidHelper.generateNeoAccount(
          mnemonic,
          index
        )
        if (!accounts.find((account) => account.address === address)) {
          const req = new AddressPaginatedRequest(address, 1)
          const {totalEntries} = await req.getAddressAbstracts()
          if (totalEntries && totalEntries > 0) {
            await createAccount(walletID, ACCOUNT_NAME_DEFAULT, WIF, address)
          } else {
            if (index < 1) {
              await createAccount(walletID, ACCOUNT_NAME_DEFAULT, WIF, address)
            }
            stop = true
          }
          index++
        } else {
          stop = true
          Alert.alert(`address: ${address} already exists`)
        }
      }
      if (!isConnected) {
        const {WIF, address} = await new Promise((resolve) => {
          resolve(AsteroidHelper.generateNeoAccount(mnemonic, index))
        })
        await createAccount(walletID, ACCOUNT_NAME_DEFAULT, WIF, address)
      }
    } else {
      Alert.alert('Mnemonic already exists')
    }
  }

  const createWallet = async (name: string, securityPhrase: string) => {
    dispatch(RootStore.wallet.actions.clearState())
    dispatch(RootStore.wallet.actions.setName(name))
    dispatch(RootStore.wallet.actions.setSecurityPhrase(securityPhrase))
    dispatch(RootStore.wallet.actions.setType('standard'))

    const walletId = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )

    dispatch(RootStore.wallet.actions.clearState())

    await dispatchAsync(
      RootStore.wallet.actions.setShowBackupAlert(walletId, false)
    )

    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.selectWallet(walletId))

    return walletId
  }

  const createAccount = async (
    walletId: string,
    name: string,
    wif: string,
    address: string
  ) => {
    if (!address) throw new Error('Address not defined')

    dispatch(RootStore.account.actions.clearState())

    dispatch(RootStore.account.actions.setIdWallet(walletId))
    dispatch(RootStore.account.actions.setName(name))
    dispatch(
      RootStore.account.actions.setBackgroundColor(
        theme.colors.card[getRandomColor(6)]
      )
    )
    const importedAccount = (await dispatchAsync(
      RootStore.account.actions.importAndSave(address, wif)
    )) as Account
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    isConnected &&
      (await dispatchAsync(
        RootStore.app.actions.syncTokenAssetsByAddress(address)
      ))

    dispatch(RootStore.account.actions.clearState())

    return importedAccount
  }

  const onNext = async () => {
    let destination: NavParam<MoreStackParamList> | undefined = undefined

    if (wallet.isAddress(inputValue)) {
      Alert.alert(
        '',
        Facade.t('importKey.alertText'),
        [
          {
            text: Facade.t('importKey.alertCancelButton'),
            style: 'cancel',
          },
          {
            text: Facade.t('importKey.alertConfirmButton'),
            onPress: () =>
              props.navigation.navigate(Facade.route.ImportReadAccount.name, {
                address: inputValue,
              }),
          },
        ],
        {cancelable: true}
      )
    } else if (wallet.isNEP2(inputValue)) {
      destination = [Facade.route.Passphrase.name, {encryptedKey: inputValue}]
    } else if (wallet.isWIF(inputValue)) {
      const neoAccount = Facade.asteroid.generateNeoAccountFromWif(inputValue)

      if (accounts.find((account) => account.address === neoAccount.address)) {
        Alert.alert(
          '',
          Facade.t('importKey.accountAlreadyExists'),
          [
            {
              text: Facade.t('importKey.ok'),
              style: 'cancel',
            },
          ],
          {cancelable: true}
        )
      } else if (neoAccount) {
        destination = [
          Facade.route.CustomizeAccount.name,
          {
            source: Facade.route.ImportKey.name,
            address: neoAccount.address,
            legacy: true,
            wif: neoAccount.WIF,
          },
        ]
      }
    } else if (validateMnemonic(inputValue)) {
      await Facade.await.run('importKey', () => importMnemonic(inputValue))
      await dispatchAsync(RootStore.app.actions.syncWallets())
    }

    if (destination) {
      props.navigation.navigate(...destination)
    }
  }

  type TTextComponent = 'input' | 'textArea'

  const [textComponent, setTextComponent] = useState<TTextComponent>('input')

  const handleComponent = () => {
    if (validateMnemonic(inputValue)) {
      setTextComponent('textArea')
    }
  }

  return (
    <ScreenLayout>
      <AwaitActivity
        name={'importKey'}
        loadingView={<ScreenLoader />}
        onLoadingEnd={() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: Facade.route.Tab.name}],
          })
          props.navigation.replace(Facade.route.ListWalletsPage.name, {})
        }}
      >
        <LinearLayout orientation="verti" width="100%" height="100%">
          <TextView
            textAlign="center"
            fontSize={18}
            color={theme.colors.text[0]}
            alignSelf="center"
            justifyContent={'flex-end'}
            mb={!isConnected ? '14%' : '10px'}
            flexWrap="wrap"
            m={40}
          >
            {Facade.t('importKey.enterAnAddress')}
          </TextView>
          <LinearLayout orientation={'horiz'} justifyContent={'center'} mb={21}>
            {isMnemonic(inputValue) && validateMnemonic(inputValue) ? (
              <>
                <ImageView
                  resizeMode="center"
                  source={require('~/src/assets/images/check-material.png')}
                />
                <TextView
                  ml={'10px'}
                  textAlign="center"
                  fontSize={'16px'}
                  color={theme.colors.primary}
                  alignSelf="center"
                  flexWrap="wrap"
                >
                  {Facade.t('importKey.mnemonicComplete')}
                </TextView>
              </>
            ) : isMnemonic(inputValue) && !validateMnemonic(inputValue) ? (
              <>
                <LinearLayout mt={1}>
                  <ImageView
                    resizeMode="center"
                    source={require('~/src/assets/images/clear-material.png')}
                  />
                </LinearLayout>
                <TextView
                  ml={'10px'}
                  textAlign="center"
                  fontSize={'16px'}
                  color={theme.colors.quinary}
                  alignSelf="center"
                  flexWrap="wrap"
                >
                  {Facade.t('importKey.mnemonicIncorrect')}
                </TextView>
              </>
            ) : (
              <></>
            )}
          </LinearLayout>
          <InputWithValidation
            onChangeText={(text) => setInputValue(text)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            validator={validator}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.background[4]}
            invalidMessageColor={theme.colors.quinary}
            isMultiline={isMnemonic(inputValue)}
            fromImportKey={true}
          />

          {inputIsValid && (
            <LinearLayout
              mt={20}
              width="90%"
              flex={1}
              alignSelf="center"
              justifyContent={'flex-end'}
              mb={!isConnected ? '12%' : '10px'}
            >
              <ThemedButton label="Next" onPress={onNext} />
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportKey
