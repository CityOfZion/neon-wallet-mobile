import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useCallback, useEffect} from 'react'
import {View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import ScreenLoader from '../components/loader/ScreenLoader'

import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {
  BlockchainServiceKey,
  getBlockchainByPrivateKeyWithPassword,
  blockchainList,
} from '~src/blockchain'
import AddressesImportList from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {applicationConfig} from '~src/config/ApplicationConfig'
import {useAccountHook, useWalletHook} from '~src/hooks'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface PassphraseParams {
  encryptedKey: string
}

interface PassphraseProps {
  navigation: StackNavigationProp<
    MoreStackParamList & WalletStackParamList & RootStackParamList
  >
  route: RouteProp<MoreStackParamList, 'Passphrase'>
}

const Passphrase = (props: PassphraseProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {accounts} = useSelector((state: RootState) => state.app)
  const {createWallet} = useWalletHook()
  const {createAccount} = useAccountHook()
  const [inputValue, setInputValue] = useState('')
  const [addressesInfo, setAdrresesInfo] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const [addressesInfoSelected, setAdrresesInfoSelected] = useState<
    {address: string; blockchain: BlockchainServiceKey}[]
  >([])
  const [titlePage, setTitlePage] = useState<string>(
    i18n.t('passphrase.enterPassphrase')
  )
  const [correctPassword, setCorrectPassword] = useState<string>('')
  const [inputIsValid, setInputIsValid] = useState(true)
  const [showInputField, setShowInputField] = useState(true)
  const encryptedKey = props.route.params.encryptedKey

  const account = new Account()
  account.address = 'ThisIsAPlaceholderAddress'
  account.srcIcon = require('~src/assets/images/card-neo.png')

  const clearOnFocus = () => {
    if (!inputIsValid) {
      setInputValue('')
    }
  }

  const validatePassword = useCallback(async () => {
    setShowInputField(false)
    try {
      for (const blockchain of blockchainList) {
        const isEncryptedKey = applicationConfig.blockchain[
          blockchain
        ].validatePrivateKeyWithPassword(encryptedKey)
        if (isEncryptedKey) {
          const {address} = await applicationConfig.blockchain[
            blockchain
          ].decryptKey(encryptedKey, inputValue)
          const addressExist = accounts.some((acc) => acc.address === address)
          if (!addressExist) {
            setAdrresesInfo((prevState) => {
              const data = prevState
              data.push({address, blockchain})
              return [...data]
            })
          }
          if (inputValue.length > 0) {
            setCorrectPassword(inputValue)
          }
          setInputValue('')
        }
      }
      if (addressesInfo.length < 1) {
        showMessage({
          message: i18n.t(
            'blockchainServices.errorMessages.keyWrongOrAddressesImported'
          ),
          type: 'danger',
          duration: 4000,
        })
        setShowInputField(true)
      }
    } catch (error) {
      if (addressesInfo.length < 1) {
        showMessage({
          message: i18n.t(
            'blockchainServices.errorMessages.keyWrongOrAddressesImported'
          ),
          type: 'danger',
          duration: 4000,
        })
        setShowInputField(true)
      }
    }
  }, [inputValue])

  const handleDisableNextButton = useCallback(() => {
    if (inputValue.length > 0 || addressesInfoSelected.length > 0) {
      return false
    } else {
      return true
    }
  }, [inputValue, addressesInfoSelected])

  const persist = useCallback(async () => {
    try {
      for (const {address, blockchain} of addressesInfoSelected) {
        const isEncryptedKey = applicationConfig.blockchain[
          blockchain
        ].validatePrivateKeyWithPassword(encryptedKey)
        if (isEncryptedKey) {
          const {wif} = await applicationConfig.blockchain[
            blockchain
          ].decryptKey(encryptedKey, correctPassword)
          const mnemonic = applicationConfig.blockchain[blockchain]
            .generateMnemonic()
            ?.join(',')
          if (mnemonic) {
            const idWallet = await createWallet(
              `${i18n.t(`blockchainServices.${blockchain}.id`)} ${i18n.t(
                'modals.blockchainList.encryptedWallet'
              )}`,
              mnemonic,
              'legacy'
            )
            await createAccount(
              idWallet,
              `${i18n.t(`blockchainServices.${blockchain}.label`)} Account`,
              wif,
              address,
              blockchain
            )
          } else {
            showMessage({message: 'Problem to generate Wallet', type: 'danger'})
          }
        }
      }
      props.navigation.replace(wrapper.route.Tab.name, {
        welcomeHidden: true,
        changelogHidden: true,
        screen: wrapper.route.ListWallets.name,
      })
    } catch (error) {
      showMessage({message: 'Problem to generate Wallet', type: 'danger'})
    }
  }, [inputValue, addressesInfoSelected, showInputField])

  const handleClickNext = useCallback(async () => {
    if (showInputField) {
      await validatePassword()
    } else {
      await persist()
    }
  }, [inputValue, addressesInfoSelected])

  useEffect(() => {
    if (addressesInfoSelected.length > 0) {
      setTitlePage('Please select the correct account from you Encrypted Key')
    }
  }, [addressesInfoSelected])

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

          {showInputField && (
            <View style={{minHeight: 100}}>
              <InputWithValidation
                value={inputValue}
                onChangeText={setInputValue}
                validator={(text) => inputIsValid || !text}
                color={theme.colors.primary}
                invalidColor={theme.colors.primary}
                separatorColor={theme.colors.background[4]}
                invalidSeparatorColor={theme.colors.background[5]}
                placeholder={i18n.t('passphrase.inputPlaceholder')}
                secure={true}
                onFocus={clearOnFocus}
                hideScan={true}
              />
            </View>
          )}

          {addressesInfo.length > 0 && (
            <AddressesImportList
              addressesInfo={addressesInfo}
              onSelectAddress={(it) => {
                setAdrresesInfoSelected(it)
              }}
            />
          )}

          <LinearLayout mt={80} width="90%" alignSelf="center">
            <ThemedButton
              disabled={handleDisableNextButton()}
              label={i18n.t('passphrase.next')}
              onPress={async () => {
                Await.run(
                  'importEncryptedKey',
                  handleClickNext,
                  showInputField ? 1000 : 5000
                )
              }}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default Passphrase
