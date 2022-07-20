import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Keyboard } from 'react-native'

import ThemedCloseButton from '../components/themed/ThemedCloseButton'
import { TokenHelper } from '../helpers/TokenHelper'
import { useBalance } from '../hooks/useBalance'
import { useTokens } from '../hooks/useTokens'
import { Token } from '../models/Token'

import { Normalize } from '~src/app/Normalize'
import { SearchBar } from '~src/components/SearchBar'
import SwiperPanel, { PANEL_OFFSET, useSwiperController } from '~src/components/SwiperPanel'
import { Account } from '~src/models/redux/Account'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface ListTokenModalParams {
  onPress(token: Token): void
  account: Account
  filterBy?: 'send' | 'receive'
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ListTokenModal'>
}

interface TokenToList extends Token {
  amount: number
}

interface ItemProps {
  token: TokenToList
  account: Account
  onPress(): void
}

const Item = React.memo(({ token, account, onPress }: ItemProps) => {
  return (
    <ButtonView py="12px" orientation="horiz" alignItems="center" onPress={onPress}>
      <ImageView
        height={Normalize.scale(29)}
        width={Normalize.scale(29)}
        alignSelf="center"
        mr="12px"
        resizeMode="contain"
        source={TokenHelper.getIcon(token.symbol, account.blockchain)}
      />
      <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
        {token.symbol}
      </TextView>

      <LinearLayout mr="15px">
        <TextView textAlign="right" fontFamily="medium" fontSize="14px" color="text.2">
          {i18n.t('modals.listTokenModal.holding')}
        </TextView>

        <TextView textAlign="right" fontFamily="bold" fontSize="18px" color="text.0">
          {token.amount}
        </TextView>
      </LinearLayout>

      <ImageView
        mt={4}
        width={Normalize.scale(26)}
        height={Normalize.scale(26)}
        resizeMode="contain"
        source={require('~src/assets/images/green_plus.png')}
      />
    </ButtonView>
  )
})

const ListTokenModal = (props: Props) => {
  const { account, filterBy = 'receive', onPress } = props.route.params

  const controller = useSwiperController(true)
  const { tokens } = useTokens({ blockchain: account.blockchain })
  const { balance } = useBalance(account)

  const [filter, setFilter] = useState('')

  const tokenList = useMemo<TokenToList[] | undefined>(() => {
    if (filterBy === 'receive') {
      return tokens.map(token => {
        const tokenBalance = balance?.tokensBalances.find(tokenBalance => tokenBalance.symbol === token.symbol)

        return {
          ...token,
          amount: tokenBalance?.amount ?? 0,
        }
      })
    }

    return balance?.tokensBalances
  }, [filterBy, tokens, balance])

  const filteredTokens = useMemo(() => {
    if (!tokenList) return

    if (!filter) return tokenList

    return tokenList.filter(token => token.name.includes(filter) || token.symbol.includes(filter))
  }, [filter, tokenList])

  const handlePress = (token: Token) => {
    if (onPress) onPress(token)

    controller.close()
  }

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.listTokenModal.tokens')}
      onRightPress={controller.close}
      padding={0}
      smallerSize
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
      solidColorBG
    >
      <LinearLayout width="100%" paddingX={16} pb={PANEL_OFFSET}>
        <TextView textAlign="center" fontFamily="medium" fontSize={18} color="text.0">
          {filterBy === 'send'
            ? i18n.t('modals.listTokenModal.selectTokenSend')
            : i18n.t('modals.listTokenModal.selectTokenReceive')}
        </TextView>
        <SearchBar lighterColor marginX={-5} onFilter={setFilter} />

        <FlatList
          data={filteredTokens}
          keyExtractor={item => item.symbol}
          ItemSeparatorComponent={() => <LinearLayout bg="background.10" height={1} />}
          renderItem={({ item }) => <Item onPress={() => handlePress(item)} token={item} account={account} />}
          ListEmptyComponent={
            <TextView fontWeight="500" color="text.0" fontSize={18} pt={5} textAlign="center">
              {i18n.t('persistContact.noResultsFound')}
            </TextView>
          }
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ListTokenModal
