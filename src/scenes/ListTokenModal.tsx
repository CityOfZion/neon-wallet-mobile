import { Token } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useState } from 'react'
import { FlatList } from 'react-native'

import { Skeleton } from '../components/Skeleton'
import { TokenIcon } from '../components/TokenIcon'
import { useBalances } from '../hooks/useBalances'
import { useLocalTokens } from '../hooks/useTokens'
import { Account } from '../store/account/Account'
import { TokenBalance } from '../types/query'

import { Normalize } from '~src/app/Normalize'
import { SearchBar } from '~src/components/SearchBar'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
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

interface ItemProps {
  tokenBalance: TokenBalance
  account: Account
  onPress(): void
}

const Item = React.memo(({ tokenBalance, onPress, account }: ItemProps) => {
  return (
    <ButtonView py="12px" orientation="horiz" alignItems="center" onPress={onPress}>
      <TokenIcon height={28} width={28} marginRight={12} blockchain={account.blockchain} {...tokenBalance.token} />

      <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
        {tokenBalance.token.symbol}
      </TextView>

      <LinearLayout mr="15px">
        <TextView textAlign="right" fontFamily="medium" fontSize="14px" color="text.2">
          {i18n.t('modals.listTokenModal.holding')}
        </TextView>

        <TextView textAlign="right" fontFamily="bold" fontSize="18px" color="text.0">
          {tokenBalance.amount}
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
  const { tokens } = useLocalTokens({ blockchain: account.blockchain })
  const balance = useBalances(account)

  const [filter, setFilter] = useState('')

  const tokenBalanceList = useMemo<TokenBalance[] | undefined>(() => {
    if (filterBy === 'receive') {
      return tokens.map(token => {
        const tokenBalance = balance.data?.tokensBalances.find(
          tokenBalance => tokenBalance.token.symbol === token.symbol
        )

        return {
          blockchain: account.blockchain,
          token,
          amount: tokenBalance?.amount ?? '0',
          amountNumber: tokenBalance?.amountNumber ?? 0,
        }
      })
    }

    if (!balance.data) return

    return balance.data.tokensBalances
  }, [filterBy, tokens, balance])

  const filteredTokens = useMemo(() => {
    if (!tokenBalanceList) return
    if (!filter) return tokenBalanceList
    return tokenBalanceList.filter(
      tokenBalance => tokenBalance.token.name.includes(filter) || tokenBalance.token.symbol.includes(filter)
    )
  }, [filter, tokenBalanceList])

  const handlePress = (token: Token) => {
    if (onPress) onPress(token)
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.listTokenModal.tokens')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
      withoutScrollView
    >
      <LinearLayout width="100%" flexGrow={1} flexShrink={1}>
        <TextView textAlign="center" fontFamily="medium" fontSize={18} color="text.0">
          {filterBy === 'send'
            ? i18n.t('modals.listTokenModal.selectTokenSend')
            : i18n.t('modals.listTokenModal.selectTokenReceive')}
        </TextView>
        <SearchBar lighterColor isDisabled={balance.isLoading} onFilter={setFilter} />

        <Skeleton
          isLoading={balance.isLoading}
          layout={[
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
            { width: '100%', height: 48, marginVertical: 5 },
          ]}
        >
          <FlatList
            data={filteredTokens}
            keyExtractor={item => item.token.hash}
            ItemSeparatorComponent={() => <LinearLayout bg="background.10" height={1} />}
            renderItem={({ item }) => (
              <Item onPress={() => handlePress(item.token)} tokenBalance={item} account={account} />
            )}
            ListEmptyComponent={
              <TextView fontWeight="500" color="text.0" fontSize={18} pt={5} textAlign="center">
                {i18n.t('persistContact.noResultsFound')}
              </TextView>
            }
          />
        </Skeleton>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ListTokenModal
