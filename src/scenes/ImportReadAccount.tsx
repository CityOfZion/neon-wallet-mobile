import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {
  BlockchainServiceKey,
  getBlockchainByAddress,
  validateAddressAllBlockchains,
  blockchainList,
  blockchainServices,
} from '~src/blockchain'
import AddressesImportList from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {useBlockchainActionsHook} from '~src/hooks'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface ImportReadAccountParams {
  address?: string
}

interface ImportReadAccountProps {
  navigation: StackNavigationProp<
    MoreStackParamList & WalletStackParamList & RootStackParamList
  >
  route: RouteProp<MoreStackParamList, 'ImportReadAccount'>
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const [inputValue, setInputValue] = useState(
    props.route.params ? props.route.params.address ?? '' : ''
  )
  const [errorMessage, setErrorMessage] = useState(
    i18n.t('components.inputTextWithValidation.incorrectFormat')
  )
  const [canAddAccount, setCanAddAccount] = useState(false)
  const [addressesList, setAddressesList] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const [addressesListSelected, setAddressesListSelected] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const {isConnected} = useSelector((state: RootState) => state.network)
  const blockchainActionsHook = useBlockchainActionsHook()
  const {walletIdState} = blockchainActionsHook
  const persist = async () => {
    if (!isValid()) {
      return
    }
    const blockchainName = getBlockchainByAddress(inputValue)
    if (!blockchainName) return
    const mnemonic = blockchainServices[blockchainName].generateMnemonic()
    if (!Array.isArray(mnemonic)) {
      throw new Error(
        i18n.t('importKey.mnemonicAlreadyExists', {
          mnemonic,
        })
      )
    }
    Await.init('importWatchAccount')
    blockchainActionsHook.init()
    await blockchainActionsHook.createWallet(
      i18n.t('defaultNameWallet.watchAccount'),
      mnemonic.join(','),
      'watch'
    )
  }

  const importAccounts = useCallback(
    async (walletId: string) => {
      for (const addressInfo of addressesListSelected) {
        await blockchainActionsHook.importWatchAccount(
          walletId,
          `${i18n.t(
            `blockchainServices.${addressInfo.blockchain}.label`
          )} ${i18n.t('modals.blockchainList.typeAccount', {type: 'Watch'})}`,
          addressInfo.address,
          addressInfo.blockchain
        )
      }
      blockchainActionsHook.finish()
      Await.done('importWatchAccount')
      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
      })
    },
    [addressesListSelected]
  )

  useEffect(() => {
    if (walletIdState) {
      importAccounts(walletIdState)
    }
  }, [walletIdState])

  const isValid = () => {
    const conditions: boolean[] = [validateAddressAllBlockchains(inputValue)]

    return conditions.every((it) => it)
  }

  const handleChangeAddressesListSelected = useCallback(
    (
      addressInfoSelected: {
        address: string
        blockchain: BlockchainServiceKey
      }[]
    ) => {
      setAddressesListSelected(addressInfoSelected)
    },
    [addressesListSelected]
  )

  function validateInput() {
    let isInputValid = validateAddressAllBlockchains(inputValue)
    if (!isInputValid) {
      setErrorMessage(
        i18n.t('components.inputTextWithValidation.incorrectFormat')
      )
    } else if (accounts.find((account) => account.address === inputValue)) {
      // don't allow to include if the account was already added
      isInputValid = false
      setErrorMessage(i18n.t('importReadAccount.accountAlreadyExists'))
    }
    setCanAddAccount(isInputValid)
    return isInputValid
  }

  useEffect(() => {
    for (const blockchain of blockchainList) {
      const addressIsValid = blockchainServices[blockchain].validateAddress(
        inputValue
      )
      if (addressIsValid) {
        setAddressesList([...addressesList, {address: inputValue, blockchain}])
      }
    }
  }, [inputValue])

  return (
    <ScreenLayout useHeaderPadding={true} darkerSolidColorBG={true}>
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
            onChangeText={(text) => setInputValue(text)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.background[3]}
            value={inputValue}
            validator={() => validateInput() || !inputValue}
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
              addressesInfo={addressesList}
              onSelectAddress={handleChangeAddressesListSelected}
            />
          </LinearLayout>

          {canAddAccount && (
            <LinearLayout
              width="90%"
              flex={1}
              alignSelf="center"
              justifyContent={'flex-end'}
              mb={!isConnected ? '14%' : '10px'}
            >
              <ThemedButton
                label={i18n.t('importReadAccount.add')}
                onPress={persist}
                disabled={addressesListSelected.length < 1}
              />
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ImportReadAccount
