import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey, getBlockchainLogo } from '~/src/blockchain'
import { LinearLayoutProps } from '~/src/types/styled-components'
import { SearchBar } from '~src/components/SearchBar'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState } from '~src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface AccountListProps extends LinearLayoutProps {
  onSelect?: (account: Account) => void
  filterByBlockchain?: BlockchainServiceKey
}

interface ItemProps {
  account: Account
  wallet?: Wallet
  onPress: (account: Account) => void
}

const Item = React.memo(({ account, onPress, wallet }: ItemProps) => {
  const walletName =
    account.accountType === 'standard'
      ? wallet?.name
      : account.accountType === 'watch'
      ? i18n.t('components.accountList.watch')
      : ''

  const walletIcon =
    account.accountType === 'standard'
      ? require('~src/assets/images/icon-wallet-small-grey.png')
      : account.accountType === 'watch'
      ? require('~src/assets/images/icon-watch-small-grey.png')
      : undefined

  const handlePress = () => {
    onPress(account)
  }

  return (
    <ButtonView onPress={handlePress}>
      <LinearLayout orientation="horiz" width="100%" alignItems="flex-start" py="16px">
        <LinearLayout width="18px" height="18px" mr="16px" mt="6px" bg={account.backgroundColor} borderRadius={9} />

        <LinearLayout orientation="verti" weight={1}>
          <LinearLayout orientation="horiz" mb="8px" alignItems="flex-end">
            <TextView weight={1} fontSize="18px" color="text.0">
              {account.name}
            </TextView>
            {!!walletName && (
              <TextView fontSize="12px" fontFamily="bold" color="background.10">
                {walletName.toUpperCase()}
              </TextView>
            )}
            {!!walletIcon && <ImageView ml="8px" source={walletIcon} />}
          </LinearLayout>

          <LinearLayout orientation="horiz">
            <ImageView
              width={22}
              height={23}
              source={getBlockchainLogo(account.blockchain)}
              resizeMode="center"
              mr={3}
              alignSelf="center"
            />
            <LinearLayout orientation="verti" width="92%">
              <TextView color="text.2" fontFamily="regular" fontSize={14}>
                {i18n.t(`blockchainServices.${account.blockchain}.id`)}
              </TextView>
              <TextView width="88%" fontSize="16px" color="primary" ellipsizeMode="middle" numberOfLines={1}>
                {account.address}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
})

export const AccountList = ({ filterByBlockchain, onSelect, ...props }: AccountListProps) => {
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)

  const [filter, setFilter] = useState('')

  const accountFilterByBlockchain = useMemo(() => {
    if (!filterByBlockchain) return accounts

    return accounts.filter(account => account.blockchain === filterByBlockchain)
  }, [filterByBlockchain, accounts])

  const accountsFiltered = useMemo(() => {
    return accountFilterByBlockchain.filter(account => {
      const wallet = account.getWallet(wallets)

      if (!account.name || !account.address || !wallet?.name) return false

      const filterLowerCase = filter.toLowerCase()

      return (
        account.name.toLowerCase().includes(filterLowerCase) ||
        account.address.toLowerCase().includes(filterLowerCase) ||
        wallet.name.toLowerCase().includes(filterLowerCase)
      )
    })
  }, [filter, accountFilterByBlockchain])

  const handlePress = (account: Account) => {
    if (onSelect) onSelect(account)
  }

  return (
    <LinearLayout {...props}>
      <SearchBar onFilter={setFilter} />
      <FlatList
        data={accountsFiltered}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => <Item account={item} wallet={item.getWallet(wallets)} onPress={handlePress} />}
        ItemSeparatorComponent={() => <LinearLayout weight={1} height="1px" bg="background.10" mx="16px" />}
        ListEmptyComponent={
          <TextView fontWeight={600} color="text.0" fontSize={18} pt={5} textAlign="center">
            {i18n.t('persistContact.noResultsFound')}
          </TextView>
        }
      />
    </LinearLayout>
  )
}
