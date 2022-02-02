import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback} from 'react'
import {Alert, View, ScrollView, TextInput, Platform} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector, useDispatch} from 'react-redux'

import {MnemonicSelectionInfo} from './MnemonicSelectionList'

import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
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
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {getRandomColor} from '~src/scenes/CustomizeAccount'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, ImageView, TextView} from '~src/styles/styled-components'

type ParamList = MoreStackParamList & WalletStackParamList & RootStackParamList
interface ImportKeyProps {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<MoreStackParamList, 'ImportKey'>
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
  const {accounts, tokens} = useSelector((state: RootState) => state.app)
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
  const [disableButton, setDisableButton] = useState<boolean>(false)
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const importMnemonic = async (mnemonic: string) => {
    const mnemonicIsImported = (await dispatchAsync(
      RootStore.wallet.actions.mnemonicIsImported(mnemonic)
    )) as boolean
    if (!mnemonicIsImported) {
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

      if (!isConnected) {
        showMessage({
          message: i18n.t('importKey.offline'),
          type: 'danger',
        })
        return null
      }
      return allAccountsInfo
    } else {
      Alert.alert(
        i18n.t('importKey.mnemonicAlreadyExists', {
          mnemonic,
        })
      )
      return null
    }
  }

  const createWallet = async (name: string, securityPhrase: string) => {
    dispatch(RootStore.wallet.actions.setName(name))
    dispatch(RootStore.wallet.actions.setSecurityPhrase(securityPhrase))
    dispatch(RootStore.wallet.actions.setType('standard'))

    const walletId = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )

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
    address: string,
    blockchain: BlockchainServiceKey
  ) => {
    if (!address) throw new Error('Address not defined')

    dispatch(RootStore.account.actions.setIdWallet(walletId))
    dispatch(RootStore.account.actions.setName(name))
    dispatch(
      RootStore.account.actions.setBackgroundColor(
        theme.colors.card[getRandomColor(6)]
      )
    )
    dispatch(RootStore.account.actions.setBlockchain(blockchain))
    const importedAccount = (await dispatchAsync(
      RootStore.account.actions.importAndSave(address, wif)
    )) as Account

    if (isConnected) {
      await importedAccount.populateTokenAssets()
      await importedAccount.populateTransactions(tokens)
      await dispatchAsync(
        RootStore.app.actions.syncTokenAssetsByAddress(address)
      )
    }
    dispatch(
      RootStore.account.actions.setTokenAssets(importedAccount.tokenAssets)
    )

    if (importedAccount.address) {
      await dispatchAsync(
        RootStore.account.actions.updateAndSave(importedAccount.address)
      )
    }
    await dispatchAsync(RootStore.app.actions.syncAccounts())

    return importedAccount
  }

  const handleChangeWhenAddress = useCallback(() => {
    if (validateAddressAllBlockchains(inputValue)) {
      const blockchainName = getBlockchainByAddress(inputValue)
      if (!blockchainName) {
        showMessage({
          message: i18n.t(
            'blockchainServices.errorMessages.blockchainNotFound'
          ),
          type: 'danger',
        })
        throw new Error(
          i18n.t('blockchainServices.errorMessages.blockchainNotFound')
        )
      }
      setAddressesFound([{address: inputValue, blockchain: blockchainName}])
      if (!addressAlreadyExist(inputValue)) {
        setAddressesSelected([
          {address: inputValue, blockchain: blockchainName},
        ])
        return true
      } else {
        showMessage({
          message: i18n.t('importKey.accountAlreadyExists', {
            account: inputValue,
          }),
          animationDuration: 1000,
          duration: 3000,
        })
        return false
      }
    }
  }, [inputValue])

  const addressAlreadyExist = useCallback(
    (address: string) => {
      if (accounts.find((account) => account.address === address)) {
        return true
      } else {
        return false
      }
    },
    [accounts]
  )

  const handleChangeWhenEncryptedKey = useCallback(() => {
    let destination: NavParam<MoreStackParamList> | undefined = undefined
    if (validatePrivateKeyWithPasswordAllBlockchains(inputValue)) {
      destination = [wrapper.route.Passphrase.name, {encryptedKey: inputValue}]
    }
  }, [inputValue])

  const handleChangeWhenWIF = useCallback(() => {
    if (validateWifAllBlockchains(inputValue)) {
      for (const blockchainName of blockchainList) {
        if (blockchainServices[blockchainName].validateWif(inputValue)) {
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
            setAddressesFound((prevState) => {
              const data = prevState
              const addressExist = data.find(
                (addressFound) =>
                  addressFound.address === addressFromWif &&
                  addressFound.blockchain === blockchainName
              )
              if (addressExist) {
                const indexOf = data.indexOf(addressExist)
                data.splice(indexOf, 1)
              }
              return [...data]
            })
          } else {
            setAddressesFound((prevState) => {
              const data = prevState
              data.push({address: addressFromWif, blockchain: blockchainName})
              return [...data]
            })
            setShowImportList(true)
          }
        }
      }
    }
  }, [inputValue])

  const handleChangeWhenMnemonic = useCallback(async () => {
    if (validateMnemonic(inputValue)) {
      setDisableButton(false)
    }
  }, [inputValue])

  const handleChangeInput = useCallback(async () => {
    handleChangeWhenAddress()
    handleChangeWhenEncryptedKey()
    handleChangeWhenWIF()
    handleChangeWhenMnemonic()
  }, [inputValue])

  const persistImport = useCallback(async () => {
    if (validateAddressAllBlockchains(inputValue)) {
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
    } else if (validatePrivateKeyWithPasswordAllBlockchains(inputValue)) {
      props.navigation.navigate(wrapper.route.Passphrase.name, {
        encryptedKey: inputValue,
      })
    } else if (validateWifAllBlockchains(inputValue)) {
      const mnemonic = blockchainServices[
        addressesSelected[0].blockchain
      ].generateMnemonic()
      if (!Array.isArray(mnemonic)) {
        throw new Error(
          i18n.t('importKey.mnemonicAlreadyExists', {
            mnemonic,
          })
        )
      }
      const idWallet = await createWallet(
        i18n.t('defaultNameWallet.importedWallet'),
        mnemonic.join(',')
      )
      dispatch(RootStore.wallet.actions.selectWallet(idWallet))
      for (const addressSelected of addressesSelected) {
        await createAccount(
          idWallet,
          `${i18n.t(
            `blockchainServices.${addressSelected.blockchain}.accountName`
          )} 1`,
          inputValue,
          addressSelected.address,
          addressSelected.blockchain
        )
      }
      await dispatchAsync(RootStore.app.actions.syncWallets())
      await dispatchAsync(RootStore.app.actions.syncAccounts())

      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
      })
      props.navigation.navigate(wrapper.route.GetWallet.name, {})
    } else if (validateMnemonic(inputValue)) {
      const dataAccountsToImport = await importMnemonic(inputValue)
      if (dataAccountsToImport) {
        props.navigation.navigate(wrapper.route.MnemonicSelectionList.name, {
          data: dataAccountsToImport,
          mnemonic: inputValue,
        })
      }
    }
  }, [addressesSelected, inputValue])

  const validator = useCallback(
    (text: string) => {
      try {
        if (text.includes(' ')) {
          if (validateMnemonic(text)) {
            setInputIsValid(true)
            return true
          } else {
            setInputIsValid(false)
            return false
          }
        } else {
          if (validateTextAllBlockchains(text)) {
            setInputIsValid(true)
            return true
          } else {
            setInputIsValid(false)
            return false
          }
        }
      } catch (error) {
        setTimeout(() => {
          setInputValue('')
        }, 500)
        showMessage({
          message: i18n.t(
            'blockchainServices.errorMessages.invalidInformation'
          ),
          type: 'danger',
          duration: 8000,
        })
        setInputIsValid(false)
        return false
      }
    },
    [inputValue]
  )

  useEffect(() => {
    if (inputIsValid) {
      handleChangeInput()
    } else {
      setShowImportList(false)
      setAddressesFound([])
    }
  }, [inputIsValid])

  useEffect(() => {
    dispatch(RootStore.timer.actions.setTimerOff())
    return () => {
      dispatch(RootStore.timer.actions.setTimerOn())
    }
  }, [])
  return (
    <ScreenLayout>
      <AwaitActivity name={'importKey'} loadingView={<ScreenLoader />}>
        <ScrollView>
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
              {i18n.t('importKey.enterAnAddress')}
            </TextView>
            <LinearLayout
              orientation={'horiz'}
              justifyContent={'center'}
              mb={21}
            >
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
                    {i18n.t('importKey.mnemonicComplete')}
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
                    {i18n.t('importKey.mnemonicIncorrect')}
                  </TextView>
                </>
              ) : (
                <></>
              )}
            </LinearLayout>
            <InputWithValidation
              onChangeText={(text) => {
                const textValue = isMnemonic(text)
                  ? UtilsHelper.removeAccents(text).toLowerCase()
                  : UtilsHelper.removeAccents(text)
                setInputValue(textValue)
              }}
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
            />

            {showImportList && (
              <View style={{marginTop: 20}}>
                <TextView
                  textAlign="center"
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
              </View>
            )}

            {inputIsValid && (
              <LinearLayout
                mt={20}
                width="90%"
                flex={1}
                alignSelf="center"
                justifyContent={'flex-end'}
                mb={!isConnected ? '12%' : '10px'}
              >
                <ThemedButton
                  label="Next"
                  onPress={() => {
                    Await.run('importKey', persistImport)
                  }}
                  disabled={disableButton}
                />
              </LinearLayout>
            )}
          </LinearLayout>
        </ScrollView>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportKey
