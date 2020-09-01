import React from 'react'
import {FlatList, ListRenderItemInfo} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface AccountListProps {
  mt?: string | number
  mb?: string | number
  onAccountSelected?: (account: Account) => void
}

interface Item {
  account: Account
  wallet?: Wallet
  onClick?: (account: Account) => void
}

const ItemComponent = (props: ListRenderItemInfo<Item>) => {
  const walletName =
    props.item.account.accountType === 'standard'
      ? props.item.wallet?.name
      : props.item.account.accountType === 'watch'
      ? Facade.t('components.accountList.watch')
      : ''

  const walletIcon =
    props.item.account.accountType === 'standard'
      ? require('~src/assets/images/icon-wallet-small-grey.png')
      : props.item.account.accountType === 'watch'
      ? require('~src/assets/images/icon-watch-small-grey.png')
      : undefined

  return (
    <ButtonView onPress={() => props.item.onClick?.(props.item.account)}>
      <LinearLayout
        orientation="horiz"
        width="100%"
        alignItems="center"
        p="16px"
      >
        <LinearLayout
          width="18px"
          height="18px"
          mr="16px"
          bg={props.item.account.backgroundColor}
          borderRadius={9999}
        />

        <LinearLayout orientation="verti" weight={1}>
          <LinearLayout orientation="horiz" mb="8px" alignItems="flex-end">
            <TextView weight={1} fontSize="18px" color="text.0">
              {props.item.account.name}
            </TextView>
            <TextView fontSize="12px" fontFamily="bold" color="background.10">
              {walletName?.toUpperCase()}
            </TextView>
            {walletIcon ? (
              <ImageView ml="8px" source={walletIcon} />
            ) : undefined}
          </LinearLayout>

          <TextView
            fontSize="18px"
            color="primary"
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {props.item.account.address}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
}

const ListSeparator = () => {
  return <LinearLayout weight={1} height="2px" bg="background.10" mx="16px" />
}

export const AccountList = (props: AccountListProps) => {
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const wallets = useSelector((state: RootState) => state.app.wallets)

  const items = accounts.map((account) => {
    return {
      account,
      wallet: account.getWallet(wallets),
      onClick: props.onAccountSelected,
    }
  })

  return (
    <FlatList
      style={{marginTop: props.mt, marginBottom: props.mb}}
      data={items}
      renderItem={ItemComponent}
      ItemSeparatorComponent={ListSeparator}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}
