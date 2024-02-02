import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { showAlert } from '../components/Alert'
import { GenericWalletURLHelper } from '../helpers/GenericWalletURLHelper'
import { SecurityHelper } from '../helpers/SecurityHelper'
import { TabStackParamList } from '../navigation/TabNavigation'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWalletIds } from '../store/wallet/SelectorWallet'

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

type InputType = 'address' | 'key' | 'encryptedKey' | 'mnemonic'

type FunctionsByInputType = {
  validation(value: string): boolean
  handle(value: string): boolean | Promise<boolean>
  persist(value: string, addressSelected: AddressInfo[]): void | Promise<void>
}

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const walletIds = useSelector(selectWalletIds)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const blockchainActions = useBlockchainActions()

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
    const urlKey = GenericWalletURLHelper.validateAndParse(data)
    handleChangeInput(UtilsHelper.removeAccents(urlKey ?? data))
  }

  const addressAlreadyExist = useCallback(
    (address: string) => accounts.some(account => account.address === address),
    [accounts]
  )

  const handleChangeWhenAddress = useCallback(
    (address: string) => {
      const blockchain = bsAggregator.getBlockchainByAddress(address)

      if (!blockchain) {
        showMessage({
          message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
          type: 'danger',
        })
        return false
      }

      if (addressAlreadyExist(address)) {
        showMessage({
          message: i18n.t('importKey.accountAlreadyExists', {
            account: address,
          }),
        })
        return false
      }

      return true
    },
    [addressAlreadyExist, bsAggregator]
  )

  const handleChangeWhenEncrypted = useCallback(() => {
    return true
  }, [])

  const handleChangeWhenMnemonic = useCallback(async (mnemonic: string) => {
    for (const walletId of walletIds) {
      const mnemonicWallet = await SecurityHelper.loadMnemonic(walletId)
      if (mnemonicWallet === mnemonic) {
        showMessage({
          message: i18n.t('importKey.mnemonicAlreadyExists'),
          type: 'danger',
        })

        return false
      }
    }

    return true
  }, [])

  const handleChangeWhenKey = useCallback(
    (key: string) => {
      const addresses: AddressInfo[] = []

      for (const service of bsAggregator.blockchainServices) {
        if (!service.validateKey(key)) {
          continue
        }

        const account = service.generateAccountFromKey(key)

        if (addressAlreadyExist(account.address)) {
          continue
        }

        addresses.push({ address: account.address, blockchain: service.blockchainName })
      }

      setAddressesFound(addresses)
      setAddressesSelected(addresses)

      if (addresses.length === 0) {
        showMessage({
          message: i18n.t('importKey.allAddressesAreAlreadyImported'),
        })
      }
      return addresses.length > 0
    },
    [addressAlreadyExist, bsAggregator]
  )

  const persistWhenAddress = useCallback((address: string) => {
    showAlert({
      subtitle: i18n.t('importKey.alertText'),
      buttons: [
        { label: i18n.t('importKey.alertCancelButton') },
        {
          label: i18n.t('importKey.alertConfirmButton'),
          onPress: () => {
            props.navigation.navigate(wrapper.route.ImportReadAccount.name, {
              address,
            })
          },
        },
      ],
    })
  }, [])

  const persistWhenEncrypted = useCallback((encrypted: string) => {
    props.navigation.navigate(wrapper.route.BlockchainListPage.name, {
      config: {
        custom: {
          btnLabel: i18n.t('app.next'),
          btnOnPress: async blockchain => {
            props.navigation.navigate(wrapper.route.Passphrase.name, {
              encrypted,
              blockchain,
            })
          },
          hideIsMulti: true,
        },
      },
    })
  }, [])

  const persistWhenKey = useCallback(
    async (key: string, addresses: AddressInfo[]) => {
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
          key,
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
    props.navigation.navigate(wrapper.route.MnemonicSelectionList.name, {
      mnemonic,
    })
  }, [])

  const functionsByInputTypes = useMemo<Record<InputType, FunctionsByInputType>>(
    () => ({
      address: {
        validation: bsAggregator.validateAddressAllBlockchains.bind(bsAggregator),
        handle: handleChangeWhenAddress,
        persist: persistWhenAddress,
      },
      encryptedKey: {
        validation: bsAggregator.validateEncryptedAllBlockchains.bind(bsAggregator),
        handle: handleChangeWhenEncrypted,
        persist: persistWhenEncrypted,
      },
      key: {
        validation: bsAggregator.validateKeyAllBlockchains.bind(bsAggregator),
        handle: handleChangeWhenKey,
        persist: persistWhenKey,
      },
      mnemonic: {
        validation: UtilsHelper.isValidMnemonic,
        handle: handleChangeWhenMnemonic,
        persist: persistWhenMnemonic,
      },
    }),
    [
      handleChangeWhenAddress,
      persistWhenAddress,
      handleChangeWhenEncrypted,
      persistWhenEncrypted,
      handleChangeWhenKey,
      persistWhenKey,
      handleChangeWhenMnemonic,
      persistWhenMnemonic,
      bsAggregator,
    ]
  )

  const handleChangeInput = useCallback(
    async (text: string) => {
      setAddressesFound([])

      const textWithOutAccents = UtilsHelper.removeAccents(text)
      const isMnemonic = UtilsHelper.isMnemonic(text)
      const textValue = isMnemonic ? textWithOutAccents.toLowerCase() : textWithOutAccents
      setInputValue(textValue)
      setIsMnemonic(isMnemonic)

      const functionsByInputType = Object.entries(functionsByInputTypes).find(([, values]) => {
        const isValid = values.validation(textValue)
        return isValid
      })

      if (!functionsByInputType) {
        setInputIsValid(false)
        return
      }

      const [key, functions] = functionsByInputType

      const inputIsValid = await functions.handle(textValue)
      setInputIsValid(inputIsValid)

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
            forceMultiLine={UtilsHelper.isIos}
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
