import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Alert, Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { GenericWalletURLHelper } from '../helpers/GenericWalletURLHelper'
import { SecurityHelper } from '../helpers/SecurityHelper'
import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
import { TabStackParamList } from '../navigation/TabNavigation'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWalletIds, selectWallets } from '../store/wallet/SelectorWallet'
import { MnemonicSelectionInfo } from './MnemonicSelectionList'

import { wrapper } from '~src/app/ApplicationWrapper'
import AddressesImportList, { AddressInfo } from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { useBlockchainActions, AccountToImport } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, ImageView, TextView } from '~src/styles/styled-components'

export type ImportKeyParams = {
  data?: string
}

interface ImportKeyProps {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList & TabStackParamList & WalletStackParamList>
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
  const params = props.route.params
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const wallets = useSelector(selectWallets)
  const walletIds = useSelector(selectWalletIds)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const selectedBlockchainNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)
  const blockchainActions = useBlockchainActions()
  const {
    getBlockchainServices,
    validateAddressAllBlockchains,
    validatePrivateKeyWithPasswordAllBlockchains,
    validateTextAllBlockchains,
    validateWifAllBlockchains,
    getBlockchainByAddress,
  } = useBlockchainServiceUtils()

  const [inputValue, setInputValue] = useState(params?.data ?? '')
  const [addressesFound, setAddressesFound] = useState<AddressInfo[]>([])
  const [inputIsValid, setInputIsValid] = useState<boolean>(false)
  const [addressesSelected, setAddressesSelected] = useState<AddressInfo[]>([])
  const [showImportList, setShowImportList] = useState<boolean>(false)
  const [disableButton, setDisableButton] = useState<boolean>(true)

  const inputType = useRef<InputType>()

  const handleSelect = (items: AddressInfo[]) => {
    setAddressesSelected(items)
  }

  const handleDeselect = (items: AddressInfo[]) => {
    setAddressesSelected(items)
  }

  const handleOnScan = (data: string) => {
    if (typeof data !== 'string') return

    const urlWIF = GenericWalletURLHelper.validateAndParse(data)

    setInputValue(urlWIF ?? UtilsHelper.removeAccents(data))
  }

  const handleOnChangeText = (text: string) => {
    const textWithOutAccents = UtilsHelper.removeAccents(text)

    const textValue = isMnemonic(text) ? textWithOutAccents.toLowerCase() : textWithOutAccents

    setInputValue(textValue)
  }

  const validator = (text: string) => {
    try {
      const isValid = text.includes(' ') ? validateMnemonic(text) : validateTextAllBlockchains(text)

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

  const mnemonicIsImported = useCallback(
    async (mnemonic: string) => {
      for (const walletId of walletIds) {
        const mnemonicWallet = await SecurityHelper.loadMnemonic(walletId)
        if (mnemonicWallet === mnemonic) {
          return true
        }
      }

      return false
    },
    [walletIds]
  )

  const addressAlreadyExist = useCallback(
    (address: string) => accounts.some(account => account.address === address),
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

    setAddressesFound([{ address: inputValue, blockchain: blockchainName }])
    setAddressesSelected([{ address: inputValue, blockchain: blockchainName }])
    setDisableButton(false)
  }, [inputValue, addressAlreadyExist])

  const handleChangeWhenEncryptedKey = useCallback(() => {
    setDisableButton(false)
  }, [])

  const handleChangeWhenWIF = useCallback(() => {
    const services = getBlockchainServices()

    const addresses: AddressInfo[] = []

    for (const service of services) {
      if (!service.validateWif(inputValue)) return

      const addressFromWif = service.generateAccountFromWif(inputValue)
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

      addresses.push({ address: addressFromWif, blockchain: service.key })
    }

    if (addresses.length === 0) return

    setAddressesFound(addresses)
    setAddressesSelected(addresses)
    setShowImportList(true)
    setDisableButton(true)
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
      { cancelable: true }
    )
  }, [inputValue])

  const persistWhenEncryptedKey = useCallback(() => {
    props.navigation.navigate(wrapper.route.BlockchainListPage.name, {
      config: {
        custom: {
          btnLabel: i18n.t('app.next'),
          btnOnPress: async blockchain => {
            props.navigation.navigate(wrapper.route.Passphrase.name, {
              encryptedKey: inputValue,
              blockchain,
            })
          },
          hideIsMulti: true,
        },
      },
    })
  }, [inputValue])

  const persistWhenWIF = useCallback(async () => {
    const wallet = await blockchainActions.createWallet(
      i18n.t('defaultNameWallet.importedWallet'),
      'legacy',
      undefined,
      true
    )

    const accountToImport = addressesSelected.map(
      ({ address, blockchain }): AccountToImport => ({
        address,
        blockchain,
        wallet,
        wif: inputValue,
        type: 'legacy',
      })
    )

    await blockchainActions.importAccounts(accountToImport)

    props.navigation.replace(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.ListWalletsPage.name,
        params: { wallet },
      },
    })
  }, [blockchainActions, inputValue, wallets])

  const persistWhenMnemonic = useCallback(async () => {
    const mnemonic = inputValue

    const IsImported = await mnemonicIsImported(mnemonic)

    if (IsImported) {
      showMessage({
        message: i18n.t('importKey.mnemonicAlreadyExists'),
        type: 'danger',
      })
      return
    }

    const allAccountsInfo: MnemonicSelectionInfo = new Map()
    const services = getBlockchainServices()

    for (const service of services) {
      let index = 0
      const accountsInfo: {
        address: string
        wif: string
        derivationIndex: number
      }[] = []

      while (isConnected) {
        const { wif, address } = await service.generateAccount(mnemonic, index)

        if (!accounts.find(account => account.address === address)) {
          await UtilsHelper.sleep(200)

          if (index !== 0) {
            if (selectedBlockchainNetworks[service.key].type === 'custom') {
              // When the user is using a custom network, we can't check if the address has transactions
              break
            }

            const { totalEntries } = await service.provider.getAddressAbstracts(address, 1)

            console.log('totalEntries', totalEntries)

            if (!totalEntries || totalEntries <= 0) {
              break
            }
          }

          accountsInfo.push({ address, wif, derivationIndex: index })
        }

        index++
      }
      allAccountsInfo.set(service.key, accountsInfo)
    }

    props.navigation.navigate(wrapper.route.MnemonicSelectionList.name, {
      data: allAccountsInfo,
      mnemonic: inputValue,
    })
  }, [inputValue])

  const functionsByInputTypes = useMemo<Record<InputType, FunctionsByInputType>>(
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
    const functionsByInputType = Object.entries(functionsByInputTypes).find(([, values]) => {
      const isValid = values.validation(inputValue)

      return isValid
    })

    if (!functionsByInputType) {
      return
    }

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

  useEffect(() => {
    if (!showImportList) return

    setDisableButton(addressesSelected.length <= 0)
  }, [showImportList, addressesSelected])

  useEffect(() => {
    if (inputIsValid) {
      handleChangeInput()
      return
    }

    setShowImportList(false)
    setAddressesFound([])
    setDisableButton(true)
  }, [inputIsValid])

  return (
    <ScreenLayout>
      <AwaitActivity name="importKey" loadingView={<ScreenLoader darkerSolidColorBG />}>
        <LinearLayout width="100%" height="100%">
          <TextView
            textAlign="center"
            fontSize={18}
            color={theme.colors.text[0]}
            alignSelf="center"
            justifyContent="flex-end"
            mb={!isConnected ? '14%' : '10px'}
            flexWrap="wrap"
            m={40}
          >
            {i18n.t('importKey.enterAnAddress')}
          </TextView>
          <LinearLayout orientation="horiz" justifyContent="center" mb={21}>
            {isMnemonic(inputValue) && (
              <>
                <LinearLayout>
                  <ImageView
                    source={
                      validateMnemonic(inputValue)
                        ? require('~/src/assets/images/check-material.png')
                        : require('~/src/assets/images/clear-material.png')
                    }
                  />
                </LinearLayout>
                <TextView
                  ml="10px"
                  textAlign="center"
                  fontSize="16px"
                  color={validateMnemonic(inputValue) ? theme.colors.primary : theme.colors.quinary}
                  alignSelf="center"
                  flexWrap="wrap"
                >
                  {i18n.t(validateMnemonic(inputValue) ? 'importKey.mnemonicComplete' : 'importKey.mnemonicIncorrect')}
                </TextView>
              </>
            )}
          </LinearLayout>
          <InputWithValidation
            onChangeText={handleOnChangeText}
            autoCapitalize={Platform.OS === 'android' ? 'none' : undefined} //fix duplicate words in android OS, in IOS the issue doesn't happen
            secure={Platform.OS === 'android' ? true : undefined}
            keyboardType={Platform.OS === 'android' ? 'visible-password' : undefined}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            validator={validator}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.background[4]}
            invalidMessageColor={theme.colors.quinary}
            isMultiline={isMnemonic(inputValue)}
            fromImportKey
            sideMargins={0}
            onScan={handleOnScan}
          />

          {showImportList && (
            <LinearLayout mt="20px">
              <TextView textAlign="center" fontSize="16px" alignSelf="center" color="text.3" mb="10px">
                {i18n.t('importKey.selectAccountTitile')}
              </TextView>
              <AddressesImportList
                onDeselect={handleDeselect}
                onSelect={handleSelect}
                items={addressesFound}
                selectedItems={addressesSelected}
                blockSelection={inputType.current !== 'mnemonic'}
              />
            </LinearLayout>
          )}

          <LinearLayout mt={20} width="90%" flex={1} alignSelf="center" justifyContent="flex-end" mb="40px">
            <ThemedButton label={i18n.t('app.next')} onPress={persistImport} disabled={disableButton} />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportKey
