import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import {Alert, View, ScrollView, Platform} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector, useDispatch} from 'react-redux'

import {IURI} from '../helpers/UriHelper'
import {AccountToImport} from '../hooks/BlockchainActionsHook'
import {MnemonicSelectionInfo} from './MnemonicSelectionList'

import {wrapper} from '~src/app/ApplicationWrapper'
import {
  BlockchainServiceKey,
  blockchainList,
  validateTextAllBlockchains,
  validateAddressAllBlockchains,
  validatePrivateKeyWithPasswordAllBlockchains,
  validateWifAllBlockchains,
  getBlockchainByAddress,
  blockchainServices,
} from '~src/blockchain'
import AddressesImportList from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {useBlockchainActionsHook} from '~src/hooks'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, ImageView, TextView} from '~src/styles/styled-components'
type ParamList = MoreStackParamList & RootStackParamList
interface ImportKeyProps {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<MoreStackParamList, 'ImportKey'>
}

type InputType = 'address' | 'wif' | 'encryptedKey' | 'mnemonic'

type FunctionsByInputType = {
  validation(value: string): boolean
  handle(): void | Promise<void>
  persist(): void | Promise<void>
}

const validateMnemonic = (word: string) => {
  const list = String(word.trim()).split(' ')
  return list.length === 12
}

const isMnemonic = (word: string) => {
  return word.split(' ').length > 1
}

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {accounts, exchange} = useSelector((state: RootState) => state.app)
  const {isConnected} = useSelector((state: RootState) => state.network)
  const [inputValue, setInputValue] = useState(
    props.route.params ? props.route.params.key ?? '' : ''
  )
  const [addressesFound, setAddressesFound] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const [inputIsValid, setInputIsValid] = useState<boolean>(false)
  const [addressesSelected, setAddressesSelected] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const [showImportList, setShowImportList] = useState<boolean>(false)
  const [disableButton, setDisableButton] = useState<boolean>(true)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const blockchainActionsHook = useBlockchainActionsHook()

  const inputType = useRef<InputType>()

  const handleOnScan = (data: string | IURI) => {
    if (typeof data !== 'string') {
      return
    }

    const textValue = UtilsHelper.removeAccents(data)

    setInputValue(textValue)
  }

  const handleOnChangeText = (text: string) => {
    const textWithOutAccents = UtilsHelper.removeAccents(text)

    const textValue = isMnemonic(text)
      ? textWithOutAccents.toLowerCase()
      : textWithOutAccents

    setInputValue(textValue)
  }

  const validator = (text: string) => {
    try {
      const isValid = text.includes(' ')
        ? validateMnemonic(text)
        : validateTextAllBlockchains(text)

      setInputIsValid(isValid)
      return isValid
    } catch {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.invalidInformation'),
        type: 'danger',
        duration: 8000,
      })
      setInputIsValid(false)
      return false
    }
  }

  const importMnemonic = useCallback(async (mnemonic: string) => {
    const mnemonicIsImported = (await dispatchAsync(
      RootStore.wallet.actions.mnemonicIsImported(mnemonic)
    )) as boolean

    if (mnemonicIsImported) {
      showMessage({
        message: i18n.t('importKey.mnemonicAlreadyExists'),
        type: 'danger',
      })
      return
    }

    let index: number = 0
    let stop: boolean = false
    const allAccountsInfo: MnemonicSelectionInfo = new Map()
    let accountsInfo: {
      address: string
      wif: string
      derivationIndex: number
    }[] = []

    for (const blockchainName of blockchainList) {
      stop = false
      index = 0
      while (!stop && isConnected) {
        const {wif, address} = blockchainServices[
          blockchainName
        ].generateAccount(mnemonic, index)
        if (!accounts.find((account) => account.address === address)) {
          await UtilsHelper.sleep(200)
          const req = blockchainServices[blockchainName].provider
          const {totalEntries} = await req.getAddressAbstracts(address, 1)
          if ((totalEntries && totalEntries > 0) || index === 0) {
            accountsInfo.push({address, wif, derivationIndex: index})
          } else {
            stop = true
          }
        }
        index++
      }
      allAccountsInfo.set(blockchainName, accountsInfo)
      accountsInfo = []
    }

    return allAccountsInfo
  }, [])

  const addressAlreadyExist = useCallback(
    (address: string) =>
      accounts.some((account) => account.address === address),
    [accounts]
  )

  const handleChangeWhenAddress = useCallback(() => {
    const blockchainName = getBlockchainByAddress(inputValue)

    if (!blockchainName) {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
        type: 'danger',
      })
      return
    }

    if (addressAlreadyExist(inputValue)) {
      showMessage({
        message: i18n.t('importKey.accountAlreadyExists', {
          account: inputValue,
        }),
        animationDuration: 1000,
        duration: 3000,
      })
      return
    }

    setAddressesSelected([{address: inputValue, blockchain: blockchainName}])
    setDisableButton(false)
  }, [inputValue, addressAlreadyExist])

  const handleChangeWhenEncryptedKey = useCallback(() => {
    setDisableButton(false)
  }, [])

  const handleChangeWhenWIF = useCallback(() => {
    for (const blockchainName of blockchainList) {
      if (!blockchainServices[blockchainName].validateWif(inputValue)) {
        return
      }

      const addressFromWif = blockchainServices[
        blockchainName
      ].generateAccountFromWif(inputValue)

      if (addressAlreadyExist(addressFromWif)) {
        showMessage({
          message: `${i18n.t('importKey.accountAlreadyExists', {
            account: addressFromWif,
          })}`,
          duration: 5000,
          type: 'danger',
        })
        return
      }

      setAddressesFound((prevState) => [
        ...prevState,
        {address: addressFromWif, blockchain: blockchainName},
      ])
      setShowImportList(true)
      setDisableButton(false)
    }
  }, [inputValue, addressAlreadyExist])

  const handleChangeWhenMnemonic = useCallback(async () => {
    setDisableButton(false)
  }, [])

  const persistWhenAddress = useCallback(() => {
    Alert.alert(
      '',
      i18n.t('importKey.alertText'),
      [
        {
          text: i18n.t('importKey.alertCancelButton'),
          style: 'cancel',
        },
        {
          text: i18n.t('importKey.alertConfirmButton'),
          onPress: () =>
            props.navigation.navigate(wrapper.route.ImportReadAccount.name, {
              address: inputValue,
            }),
        },
      ],
      {cancelable: true}
    )
  }, [inputValue])

  const persistWhenEncryptedKey = useCallback(() => {
    props.navigation.navigate(wrapper.route.Passphrase.name, {
      encryptedKey: inputValue,
    })
  }, [inputValue])

  const persistWhenWIF = useCallback(async () => {
    const mnemonic = blockchainServices[
      addressesSelected[0].blockchain
    ].generateMnemonic()

    if (!mnemonic) {
      showMessage({
        message: i18n.t('importKey.mnemonicAlreadyExists'),
        type: 'danger',
      })
      return
    }

    blockchainActionsHook.init()
    const walletId = await blockchainActionsHook.createWallet(
      i18n.t('defaultNameWallet.importedWallet'),
      mnemonic.join(','),
      'standard',
      true
    )

    const accountToImport = addressesSelected.map(
      ({address, blockchain}): AccountToImport => ({
        address,
        blockchain,
        walletId,
        wif: inputValue,
        type: 'account',
      })
    )

    await blockchainActionsHook.importAccounts(accountToImport)

    blockchainActionsHook.finish()
    props.navigation.replace(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
    })
    props.navigation.navigate(wrapper.route.GetWallet.name, {})
  }, [blockchainActionsHook, inputValue])

  const persistWhenMnemonic = useCallback(async () => {
    const dataAccountsToImport = await importMnemonic(inputValue)

    if (!dataAccountsToImport) {
      return
    }

    props.navigation.navigate(wrapper.route.MnemonicSelectionList.name, {
      data: dataAccountsToImport,
      mnemonic: inputValue,
    })
  }, [inputValue, importMnemonic])

  const functionsByInputTypes = useMemo<
    Record<InputType, FunctionsByInputType>
  >(
    () => ({
      address: {
        validation: validateAddressAllBlockchains,
        handle: handleChangeWhenAddress,
        persist: persistWhenAddress,
      },
      encryptedKey: {
        validation: validatePrivateKeyWithPasswordAllBlockchains,
        handle: handleChangeWhenEncryptedKey,
        persist: persistWhenEncryptedKey,
      },
      wif: {
        validation: validateWifAllBlockchains,
        handle: handleChangeWhenWIF,
        persist: persistWhenWIF,
      },
      mnemonic: {
        validation: validateMnemonic,
        handle: handleChangeWhenMnemonic,
        persist: persistWhenMnemonic,
      },
    }),
    [
      handleChangeWhenAddress,
      persistWhenAddress,
      handleChangeWhenEncryptedKey,
      persistWhenEncryptedKey,
      handleChangeWhenWIF,
      persistWhenWIF,
      handleChangeWhenMnemonic,
      persistWhenMnemonic,
    ]
  )

  const handleChangeInput = useCallback(async () => {
    const functionsByInputType = Object.entries(functionsByInputTypes).find(
      ([, values]) => {
        const isValid = values.validation(inputValue)

        return isValid
      }
    )

    if (!functionsByInputType) return

    const [key, functions] = functionsByInputType

    await functions.handle()
    inputType.current = key as InputType
  }, [inputValue, functionsByInputTypes])

  const persistImport = useCallback(async () => {
    try {
      Await.init('importKey')

      if (!inputType.current) {
        return
      }

      await functionsByInputTypes[inputType.current].persist()
    } catch {
      showMessage({
        message: i18n.t('importKey.genericError'),
        duration: 5000,
        type: 'danger',
      })
    } finally {
      Await.done('importKey')
    }
  }, [functionsByInputTypes])

  const grantPopulateExchange = useCallback(async () => {
    if (Object.keys(exchange).length < 1) {
      await dispatchAsync(RootStore.app.actions.fetchExchange())
      await dispatchAsync(RootStore.app.actions.syncExchange())
    }
  }, [exchange])

  useEffect(() => {
    if (inputIsValid) {
      handleChangeInput()
      return
    }

    setShowImportList(false)
    setAddressesFound([])
    setDisableButton(true)
  }, [inputIsValid])

  useEffect(() => {
    grantPopulateExchange()
  }, [grantPopulateExchange])

  return (
    <ScreenLayout darkerSolidColorBG={true}>
      <AwaitActivity name={'importKey'} loadingView={<ScreenLoader />}>
        <LinearLayout width={'100%'} height={'100%'}>
          <TextView
            textAlign={'center'}
            fontSize={18}
            color={theme.colors.text[0]}
            alignSelf={'center'}
            justifyContent={'flex-end'}
            mb={!isConnected ? '14%' : '10px'}
            flexWrap={'wrap'}
            m={40}
          >
            {i18n.t('importKey.enterAnAddress')}
          </TextView>
          <LinearLayout orientation={'horiz'} justifyContent={'center'} mb={21}>
            {isMnemonic(inputValue) && (
              <>
                <LinearLayout>
                  <ImageView
                    resizeMode={'center'}
                    source={
                      validateMnemonic(inputValue)
                        ? require('~/src/assets/images/check-material.png')
                        : require('~/src/assets/images/clear-material.png')
                    }
                  />
                </LinearLayout>
                <TextView
                  ml={'10px'}
                  textAlign={'center'}
                  fontSize={'16px'}
                  color={
                    validateMnemonic(inputValue)
                      ? theme.colors.primary
                      : theme.colors.quinary
                  }
                  alignSelf={'center'}
                  flexWrap={'wrap'}
                >
                  {i18n.t(
                    validateMnemonic(inputValue)
                      ? 'importKey.mnemonicComplete'
                      : 'importKey.mnemonicIncorrect'
                  )}
                </TextView>
              </>
            )}
          </LinearLayout>
          <InputWithValidation
            onChangeText={handleOnChangeText}
            autoCapitalize={Platform.OS === 'android' ? 'none' : undefined} //fix duplicate words in android OS, in IOS the issue doesn't happen
            secure={Platform.OS === 'android' ? true : undefined}
            keyboardType={
              Platform.OS === 'android' ? 'visible-password' : undefined
            }
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            validator={validator}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.background[4]}
            invalidMessageColor={theme.colors.quinary}
            isMultiline={isMnemonic(inputValue)}
            fromImportKey={true}
            sideMargins={0}
            onScan={handleOnScan}
          />

          {showImportList && (
            <LinearLayout mt={'20px'}>
              <TextView
                textAlign={'center'}
                fontSize={'16px'}
                alignSelf="center"
                color={'text.3'}
                mb={'10px'}
              >
                Select the correct account from the list below
              </TextView>
              <AddressesImportList
                onSelectAddress={(addressesSelected) => {
                  setAddressesSelected(addressesSelected)
                }}
                addressesInfo={addressesFound}
              />
            </LinearLayout>
          )}

          <LinearLayout
            mt={20}
            width={'90%'}
            flex={1}
            alignSelf="center"
            justifyContent={'flex-end'}
            mb={'40px'}
          >
            <ThemedButton
              label={i18n.t('app.next')}
              onPress={persistImport}
              disabled={disableButton}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportKey
