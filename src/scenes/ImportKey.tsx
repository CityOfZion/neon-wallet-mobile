import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Alert, Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { BlockchainHelper } from '../helpers/BlockchainHelper'
import { GenericWalletURLHelper } from '../helpers/GenericWalletURLHelper'
import { SecurityHelper } from '../helpers/SecurityHelper'
import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
import { TabStackParamList } from '../navigation/TabNavigation'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWalletIds } from '../store/wallet/SelectorWallet'
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
  handle(value: string): void | Promise<void>
  persist(value: string, addressSelected: AddressInfo[]): void | Promise<void>
}

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const walletIds = useSelector(selectWalletIds)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const selectedBlockchainNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)
  const blockchainActions = useBlockchainActions()
  const {
    getBlockchainServices,
    validateAddressAllBlockchains,
    validatePrivateKeyWithPasswordAllBlockchains,
    validateWifAllBlockchains,
    getBlockchainByAddress,
    validateMnemonic,
  } = useBlockchainServiceUtils()

  const [inputValue, setInputValue] = useState('')
  const [addressesFound, setAddressesFound] = useState<AddressInfo[]>([])
  const [inputIsValid, setInputIsValid] = useState<boolean>(false)
  const [addressesSelected, setAddressesSelected] = useState<AddressInfo[]>([])
  const [isMnemonic, setIsMnemonic] = useState<boolean>(false)

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
    handleChangeInput(UtilsHelper.removeAccents(urlWIF ?? data))
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

  const handleChangeWhenAddress = useCallback(
    (address: string) => {
      const blockchainName = getBlockchainByAddress(address)

      if (!blockchainName) {
        showMessage({
          message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
          type: 'danger',
        })
        return
      }

      if (addressAlreadyExist(address)) {
        showMessage({
          message: i18n.t('importKey.accountAlreadyExists', {
            account: address,
          }),
        })
        return
      }

      setInputIsValid(true)
    },
    [addressAlreadyExist, getBlockchainByAddress]
  )

  const handleChangeWhenEncryptedKey = useCallback(() => {
    setInputIsValid(true)
  }, [])

  const handleChangeWhenMnemonic = useCallback(() => {
    setInputIsValid(true)
  }, [])

  const handleChangeWhenWIF = useCallback(
    (wif: string) => {
      const services = getBlockchainServices()

      const addresses: AddressInfo[] = []

      for (const service of services) {
        if (!service.validateWif(wif)) return

        const addressFromWif = service.generateAccountFromWif(wif)
        if (addressAlreadyExist(addressFromWif)) {
          showMessage({
            message: `${i18n.t('importKey.accountAlreadyExists', {
              account: addressFromWif,
            })}`,
            type: 'danger',
          })
          return
        }

        addresses.push({ address: addressFromWif, blockchain: service.key })
      }

      if (addresses.length === 0) return

      setAddressesFound(addresses)
      setAddressesSelected(addresses)
      setInputIsValid(true)
    },
    [addressAlreadyExist, getBlockchainServices]
  )

  const persistWhenAddress = useCallback((address: string) => {
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
              address,
            }),
        },
      ],
      { cancelable: true }
    )
  }, [])

  const persistWhenEncryptedKey = useCallback((encryptedKey: string) => {
    props.navigation.navigate(wrapper.route.BlockchainListPage.name, {
      config: {
        custom: {
          btnLabel: i18n.t('app.next'),
          btnOnPress: async blockchain => {
            props.navigation.navigate(wrapper.route.Passphrase.name, {
              encryptedKey,
              blockchain,
            })
          },
          hideIsMulti: true,
        },
      },
    })
  }, [])

  const persistWhenWIF = useCallback(
    async (wif: string, addresses: AddressInfo[]) => {
      const wallet = await blockchainActions.createWallet(
        i18n.t('defaultNameWallet.importedWallet'),
        'legacy',
        undefined,
        true
      )

      const accountToImport = addresses.map(
        ({ address, blockchain }): AccountToImport => ({
          address,
          blockchain,
          wallet,
          wif,
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
    },
    [blockchainActions.createWallet, blockchainActions.importAccounts]
  )

  const persistWhenMnemonic = useCallback(async (mnemonic: string) => {
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
            if (!totalEntries || totalEntries <= 0) break
          }

          accountsInfo.push({ address, wif, derivationIndex: index })
        }

        index++
      }
      allAccountsInfo.set(service.key, accountsInfo)
    }

    props.navigation.navigate(wrapper.route.MnemonicSelectionList.name, {
      data: allAccountsInfo,
      mnemonic,
    })
  }, [])

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
      validateMnemonic,
    ]
  )

  const handleChangeInput = useCallback(
    async (text: string) => {
      setAddressesFound([])
      setInputIsValid(false)

      const textWithOutAccents = UtilsHelper.removeAccents(text)
      const isMnemonic = BlockchainHelper.isMnemonic(text)
      const textValue = isMnemonic ? textWithOutAccents.toLowerCase() : textWithOutAccents
      setInputValue(textValue)
      setIsMnemonic(isMnemonic)

      const functionsByInputType = Object.entries(functionsByInputTypes).find(([, values]) => {
        const isValid = values.validation(textValue)

        return isValid
      })

      if (!functionsByInputType) return
      const [key, functions] = functionsByInputType

      await functions.handle(textValue)

      inputType.current = key as InputType
    },
    [functionsByInputTypes]
  )

  const persistImport = useCallback(async () => {
    try {
      Await.init('importKey')

      if (!inputType.current) return

      await functionsByInputTypes[inputType.current].persist(inputValue, addressesSelected)
    } catch {
      showMessage({
        message: i18n.t('importKey.genericError'),
        type: 'danger',
      })
    } finally {
      Await.done('importKey')
    }
  }, [functionsByInputTypes, inputValue, addressesSelected])

  useEffect(() => {
    const data = props.route.params?.data
    if (!data) return
    handleChangeInput(data)
  }, [props.route.params, handleChangeInput])

  return (
    <ScreenLayout testID="screen-import-key">
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

          {isMnemonic && (
            <LinearLayout orientation="horiz" justifyContent="center" mb={21}>
              <ImageView
                width={Normalize.scale(20)}
                height={Normalize.scale(20)}
                source={
                  inputIsValid
                    ? require('~/src/assets/images/check-material.png')
                    : require('~/src/assets/images/clear-material.png')
                }
              />

              <TextView
                ml="10px"
                textAlign="center"
                fontSize="16px"
                color={inputIsValid ? theme.colors.primary : theme.colors.quinary}
                alignSelf="center"
                flexWrap="wrap"
              >
                {i18n.t(inputIsValid ? 'importKey.mnemonicComplete' : 'importKey.mnemonicIncorrect')}
              </TextView>
            </LinearLayout>
          )}

          <InputWithValidation
            testID="input-text-with-validation-import-key"
            onChangeText={handleChangeInput}
            autoCapitalize={Platform.OS === 'android' ? 'none' : undefined} //fix duplicate words in android OS, in IOS the issue doesn't happen
            secure={Platform.OS === 'android' ? true : undefined}
            keyboardType={Platform.OS === 'android' ? 'visible-password' : undefined}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            isValid={inputIsValid}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.background[4]}
            invalidMessageColor={theme.colors.quinary}
            isMultiline={isMnemonic}
            fromImportKey
            sideMargins={0}
            onScan={handleOnScan}
          />

          {addressesFound.length > 0 && (
            <LinearLayout testID="list-imported-import-key" mt="20px">
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
            <ThemedButton
              testID="btn-next-import-key"
              label={i18n.t('app.next')}
              onPress={persistImport}
              disabled={!inputIsValid || (addressesFound.length > 0 && addressesSelected.length <= 0)}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportKey
