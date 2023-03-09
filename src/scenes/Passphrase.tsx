import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
import { selectAccounts } from '../store/account/SelectorAccount'

import { wrapper } from '~src/app/ApplicationWrapper'
import AddressesImportList, { AddressInfo } from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useBlockchainActions, AccountToImport } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface PassphraseParams {
  encryptedKey: string
}

interface PassphraseProps {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'Passphrase'>
}

type AddressInfoWithWif = AddressInfo & { wif: string }

const Passphrase = (props: PassphraseProps) => {
  const encryptedKey = props.route.params.encryptedKey

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const blockchainActions = useBlockchainActions()
  const { getBlockchainServices } = useBlockchainServiceUtils()

  const [inputValue, setInputValue] = useState('')
  const [addressesList, setAddressesList] = useState<AddressInfoWithWif[]>([])
  const [addressesListSelected, setAddressesListSelected] = useState<AddressInfoWithWif[]>([])
  const [titlePage, setTitlePage] = useState<string>(i18n.t('passphrase.enterPassphrase'))

  const validatePassword = useCallback(async () => {
    Await.init('importEncryptedKey')

    try {
      const services = getBlockchainServices()
      const newAddressesInfo: AddressInfoWithWif[] = []

      for (const service of services) {
        const isEncryptedKey = service.validatePrivateKeyWithPassword(encryptedKey)
        if (!isEncryptedKey) continue

        const { address, wif } = await service.decryptKey(encryptedKey, inputValue)
        const addressExist = accounts.some(acc => acc.address === address)

        if (addressExist) continue

        newAddressesInfo.push({ address, blockchain: service.key, wif })
      }

      if (newAddressesInfo.length < 1) throw new Error("Can't decrypt key")

      setAddressesList(prevState => [...prevState, ...newAddressesInfo])
      setInputValue('')
      setTitlePage(i18n.t('passphrase.selectAccount'))
    } catch {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.keyWrongOrAddressesImported'),
        type: 'danger',
        duration: 4000,
      })
    } finally {
      Await.done('importEncryptedKey')
    }
  }, [inputValue, getBlockchainServices])

  const persist = useCallback(async () => {
    Await.init('importEncryptedKey')

    try {
      const wallet = await blockchainActions.createWallet(i18n.t('modals.blockchainList.encryptedWallet'), 'legacy')

      const accountsToImport = addressesListSelected.map(
        ({ address, blockchain, wif }): AccountToImport => ({
          address,
          blockchain,
          wallet,
          wif,
          type: 'legacy',
        })
      )
      await blockchainActions.importAccounts(accountsToImport)

      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
        params: {
          screen: wrapper.route.ListWalletsPage.name,
          params: { wallet },
        },
      })
    } catch {
      showMessage({
        message: i18n.t('messages.problemToGenerateWallet'),
        type: 'danger',
      })
    } finally {
      Await.done('importEncryptedKey')
    }
  }, [inputValue, addressesListSelected, blockchainActions])

  const handleSelect = (items: AddressInfoWithWif[]) => {
    setAddressesListSelected(items)
  }

  const handleDeselect = (items: AddressInfoWithWif[]) => {
    setAddressesListSelected(items)
  }

  return (
    <ScreenLayout>
      <AwaitActivity name="importEncryptedKey" loadingView={<ScreenLoader />}>
        <LinearLayout orientation="verti" width="100%">
          <TextView
            textAlign="center"
            fontSize={18}
            fontFamily="medium"
            color={theme.colors.text[0]}
            alignSelf="center"
            flexWrap="wrap"
            m={40}
          >
            {titlePage}
          </TextView>

          {addressesList.length > 0 ? (
            <AddressesImportList
              items={addressesList}
              selectedItems={addressesListSelected}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
            />
          ) : (
            <View style={{ minHeight: 100 }}>
              <InputWithValidation
                value={inputValue}
                onChangeText={setInputValue}
                validator={() => true}
                color={theme.colors.primary}
                invalidColor={theme.colors.primary}
                separatorColor={theme.colors.background[4]}
                invalidSeparatorColor={theme.colors.background[5]}
                placeholder={i18n.t('passphrase.inputPlaceholder')}
                secure
                hideScan
              />
            </View>
          )}

          <LinearLayout mt={80} width="90%" alignSelf="center">
            <ThemedButton
              disabled={addressesList.length > 0 ? addressesListSelected.length <= 0 : inputValue.length <= 0}
              label={i18n.t('passphrase.next')}
              onPress={addressesList.length > 0 ? persist : validatePassword}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default Passphrase
