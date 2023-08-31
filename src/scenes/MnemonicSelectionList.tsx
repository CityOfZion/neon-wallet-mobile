import { AccountWithDerivationPath } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { BlockchainIcon } from '../components/BlockchainIcon'
import ThemedButton from '../components/themed/ThemedButton'
import { RootStackParamList } from '../navigation/AppNavigation'
import { WalletStackParamList } from '../navigation/WalletsStackNavigation'
import { RootState } from '../store/RootStore'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'
import { TBlockchainServiceKey } from '../types/blockchain'

import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { AccountToImport, useBlockchainActions } from '~src/hooks/useBlockchainActions'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'

export interface MnemonicSelectionListParams {
  mnemonic: string
}

type AccountWithBlockchain = AccountWithDerivationPath & { blockchain: TBlockchainServiceKey }
interface Props {
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'MnemonicSelectionList'>
}

type HeaderProps = {
  accounts: AccountWithDerivationPath[]
  blockchain: TBlockchainServiceKey
  totalAddressesSelected: number
  isActive: boolean
}

type ContentItemProps = {
  data: AccountWithDerivationPath[]
  blockchain: TBlockchainServiceKey
  onPress: (account: AccountWithBlockchain) => void
  isSelected: (account: AccountWithBlockchain) => boolean
}

const Header = (props: HeaderProps) => {
  return (
    <LinearLayout
      flexDirection="row"
      justifyContent="space-between"
      py="10px"
      px="5px"
      borderBottomWidth="1px"
      borderColor="background.10"
    >
      <LinearLayout flexDirection="row" alignItems="flex-end">
        <BlockchainIcon blockchain={props.blockchain} width={32} height={32} mx="10px" />

        <LinearLayout>
          <TextView color="text.6" fontSize="10px" fontWeight="500">
            {i18n.t(`blockchainServices.${props.blockchain}.id`)}
          </TextView>
          <TextView color="text.0" fontSize="16px" fontWeight="bold">
            {i18n.t(`blockchainServices.${props.blockchain}.label`)}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout flexDirection="row" alignItems="flex-end">
        <TextView color="text.6" marginRight="14px" fontWeight="500" fontSize="12px">
          {i18n.t('mnemonicSelectionList.qtySelectedOfTotal', {
            qtySelected: props.totalAddressesSelected,
            total: props.accounts.length,
          })}
        </TextView>

        <TextView fontSize="30px" color="primary">
          {props.isActive ? '-' : '+'}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

const Content = (props: ContentItemProps) => {
  const handlePress = (account: AccountWithDerivationPath) => {
    props.onPress({ ...account, blockchain: props.blockchain })
  }

  const isSelected = (account: AccountWithDerivationPath) => {
    return props.isSelected({ ...account, blockchain: props.blockchain })
  }

  return (
    <LinearLayout>
      {props.data.map(item => (
        <TouchableWithoutFeedback onPress={() => handlePress(item)} key={item.address}>
          <LinearLayout
            backgroundColor="background.12"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingX="10px"
            paddingY="10px"
          >
            <LinearLayout flexGrow={1} flexShrink={1}>
              <TextView fontWeight="500" color="text.6" fontSize="14px">
                {item.derivationPath}
              </TextView>
              <TextView fontWeight="500" color="text.0" fontSize="14px">
                {item.address}
              </TextView>
            </LinearLayout>

            {isSelected(item) && (
              <ImageView
                style={{ width: 22, height: 22 }}
                ml="8px"
                resizeMode="contain"
                source={require('~src/assets/images/icon-check-green.png')}
              />
            )}
          </LinearLayout>
        </TouchableWithoutFeedback>
      ))}
    </LinearLayout>
  )
}

const MnemonicSelectionList = (props: Props) => {
  const { mnemonic } = props.route.params

  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)
  const accountAddresses = useSelector((state: RootState) => state.account.data.map(it => it.address))

  const blockchainActions = useBlockchainActions()

  const [itemsActives, setItemActives] = useState<number[]>([0])
  const [mnemonicAccounts, setMnemonicAccounts] = useState<Map<TBlockchainServiceKey, AccountWithDerivationPath[]>>()
  const [accountsSelected, setAccountsSelected] = useState<AccountWithBlockchain[]>([])

  const handlePressAccount = (accountWithBlockchain: AccountWithBlockchain) => {
    setAccountsSelected(prev => {
      if (prev.find(it => it.address === accountWithBlockchain.address)) {
        return prev.filter(it => it.address !== accountWithBlockchain.address)
      }

      return [...prev, accountWithBlockchain]
    })
  }

  const isSelected = (accountWithBlockchain: AccountWithBlockchain) => {
    return !!accountsSelected.find(it => it.address === accountWithBlockchain.address)
  }

  const handleImportAccounts = async () => {
    Await.init('importMnemonic')

    const wallet = await blockchainActions.createWallet(
      i18n.t('defaultNameWallet.mnemonicWallet'),
      'standard',
      mnemonic,
      true
    )

    const accountsToImport = accountsSelected.map(
      ({ address, blockchain, key }): AccountToImport => ({
        wallet,
        address,
        blockchain,
        key,
        type: 'standard',
      })
    )
    await blockchainActions.importAccounts(accountsToImport)

    Await.done('importMnemonic')

    props.navigation.replace(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.ListWalletsPage.name,
        params: { wallet },
      },
    })
  }

  useEffect(() => {
    Await.run(
      'importMnemonic',
      async () => {
        const accounts = await bsAggregator.generateAccountFromMnemonicAllBlockchains(mnemonic, accountAddresses)
        setMnemonicAccounts(accounts)
        const accountsArray = Array.from(accounts.entries())
          .map(([blockchain, accounts]) => {
            return accounts.map(account => ({ ...account, blockchain }))
          })
          .flat()
        setAccountsSelected(accountsArray)
      },
      500
    )
  }, [])

  return (
    <ScreenLayout>
      <AwaitActivity name="importMnemonic" loadingView={<ScreenLoader transparent />}>
        <LinearLayout flexGrow={1}>
          <TextView color="text.0" fontSize="18px" my="30px" alignSelf="center">
            {i18n.t('importKey.foundAccountsMnemonic')}
          </TextView>

          {mnemonicAccounts && mnemonicAccounts.size > 0 && (
            <Accordion
              containerStyle={{ flexGrow: 1 }}
              expandMultiple
              activeSections={itemsActives}
              sections={Array.from(mnemonicAccounts.entries())}
              renderHeader={(content, _, isActive) => {
                const totalAddressesSelected = accountsSelected.filter(it => it.blockchain === content[0]).length

                return (
                  <Header
                    accounts={content[1]}
                    blockchain={content[0]}
                    isActive={isActive}
                    totalAddressesSelected={totalAddressesSelected}
                  />
                )
              }}
              onChange={setItemActives}
              renderContent={content => (
                <Content
                  blockchain={content[0]}
                  data={content[1]}
                  onPress={handlePressAccount}
                  isSelected={isSelected}
                />
              )}
            />
          )}

          <ThemedButton
            disabled={accountsSelected.length < 1}
            label={i18n.t('routes.ImportKey')}
            onPress={handleImportAccounts}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default MnemonicSelectionList
