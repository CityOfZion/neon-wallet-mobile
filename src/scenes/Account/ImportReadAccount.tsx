import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { wrapper } from '~src/app/ApplicationWrapper'
import AddressesImportList, { AddressInfo } from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { AccountToImport, useBlockchainActions } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface ImportReadAccountParams {
  address?: string
}

interface ImportReadAccountProps {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'ImportReadAccount'>
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  const { address } = props.route.params
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const blockchainActions = useBlockchainActions()
  const { getBlockchainServices, validateAddressAllBlockchains } = useBlockchainServiceUtils()

  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState(i18n.t('components.inputTextWithValidation.incorrectFormat'))
  const [canAddAccount, setCanAddAccount] = useState(false)
  const [addressesList, setAddressesList] = useState<AddressInfo[]>([])
  const [addressesListSelected, setAddressesListSelected] = useState<AddressInfo[]>([])

  const handleSelect = (items: AddressInfo[]) => {
    setAddressesListSelected(items)
  }

  const handleDeselect = (items: AddressInfo[]) => {
    setAddressesListSelected(items)
  }

  const persist = async () => {
    Await.init('importWatchAccount')

    const wallet = await blockchainActions.createWallet(i18n.t('defaultNameWallet.watchAccount'), 'watch')

    const accountToImport = addressesListSelected.map(
      ({ address, blockchain }): AccountToImport => ({
        address,
        blockchain,
        type: 'watch',
        wallet,
      })
    )
    await blockchainActions.importAccounts(accountToImport)

    Await.done('importWatchAccount')

    props.navigation.replace(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.ListWalletsPage.name,
        params: { wallet },
      },
    })
  }

  function validateInput(text: string) {
    let isValid = validateAddressAllBlockchains(text)

    if (!isValid) {
      setErrorMessage(i18n.t('components.inputTextWithValidation.incorrectFormat'))
    } else if (accounts.find(account => account.address === text)) {
      // don't allow to include if the account was already added
      isValid = false
      setErrorMessage(i18n.t('importReadAccount.accountAlreadyExists'))
    }
    setCanAddAccount(isValid)
    return isValid
  }

  const handleChangeInput = useCallback(
    (value: string) => {
      setInputValue(value)
      const services = getBlockchainServices()

      const addresses: AddressInfo[] = []

      for (const service of services) {
        const addressIsValid = service.validateAddress(value)
        if (!addressIsValid) continue

        addresses.push({ address: value, blockchain: service.key })
      }

      setAddressesList(addresses)
      setAddressesListSelected(addresses)
    },
    [getBlockchainServices]
  )

  useEffect(() => {
    if (!address) return

    handleChangeInput(address)
  }, [address])

  return (
    <ScreenLayout useHeaderPadding darkerSolidColorBG>
      <AwaitActivity name="importWatchAccount" loadingView={<ScreenLoader />}>
        <LinearLayout orientation="verti" width="100%" height="100%">
          <TextView
            textAlign="center"
            fontSize={18}
            fontWeight={400}
            color={theme.colors.text[0]}
            alignSelf="center"
            flexWrap="wrap"
            mx={40}
            mt={4}
            mb={6}
          >
            {i18n.t('importReadAccount.headerText')}
          </TextView>

          <InputWithValidation
            onChangeText={handleChangeInput}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            validator={validateInput}
            separatorColor={theme.colors.background[5]}
            invalidSeparatorColor={theme.colors.quinary}
            invalidMessageColor={theme.colors.quinary}
            invalidMessage={errorMessage}
          />

          <LinearLayout>
            <TextView color="#7d929a" fontSize="16px" mb={5}>
              {i18n.t('importReadAccount.headerText2')}
            </TextView>
            <AddressesImportList
              items={addressesList}
              selectedItems={addressesListSelected}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
            />
          </LinearLayout>

          {canAddAccount && (
            <LinearLayout
              width="90%"
              flex={1}
              alignSelf="center"
              justifyContent="flex-end"
              mb={!isConnected ? '14%' : '10px'}
            >
              <ThemedButton
                label={i18n.t('importReadAccount.add')}
                onPress={persist}
                disabled={addressesListSelected.length <= 0}
              />
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportReadAccount
