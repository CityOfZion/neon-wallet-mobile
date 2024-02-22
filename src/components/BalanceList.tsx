import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { blockchainConfig } from '../config/BlockchainConfig'
import { BalanceConvertedToExchange, BalanceHelper } from '../helpers/BalanceHelper'
import { useLocalTokensUtils } from '../hooks/useTokens'
import { RootState } from '../store/RootStore'
import { TBlockchainServiceKey } from '../types/blockchain'
import { UseBalanceExchangeResult, TokenBalance } from '../types/query'
import { LinearLayoutProps } from '../types/styled-components'
import { Skeleton } from './Skeleton'
import { TokenIcon } from './TokenIcon'

import { FilterHelper } from '~src/helpers/FilterHelper'
import { ButtonView, LinearLayout, TextView } from '~src/styles/styled-components'

interface BalanceListItemProps {
  onPress?: (token: TokenBalance) => void
  tokenBalanceConverted: BalanceConvertedToExchange
  showBlockchain?: boolean
  showHoldingValue?: boolean
}

interface Props extends LinearLayoutProps {
  balanceExchange: UseBalanceExchangeResult
  hideEmptyMessage?: boolean
  hideTitle?: boolean
  removeZeroBalance?: boolean
  orderByValue?: boolean
  showBlockchain?: boolean
  showHoldingValue?: boolean
  onPress?: (token: TokenBalance) => void
  contentContainerStyle?: StyleProp<ViewStyle>
  blockchainFilter?: TBlockchainServiceKey
}

const BalanceListItem = React.memo(
  ({ showBlockchain = false, showHoldingValue = true, onPress, tokenBalanceConverted }: BalanceListItemProps) => {
    const language = useSelector((state: RootState) => state.settings.language)
    const currency = useSelector((state: RootState) => state.settings.currency)

    const handlePress = () => {
      if (onPress) onPress(tokenBalanceConverted)
    }

    return (
      <ButtonView onPress={handlePress} disabled={!onPress}>
        <LinearLayout orientation="horiz" alignItems="center" justifyContent="space-between" my={5}>
          <LinearLayout orientation="horiz" alignItems="center" width={showHoldingValue ? '35%' : '60%'}>
            <TokenIcon
              resizeMode="contain"
              width={24}
              height={24}
              blockchain={tokenBalanceConverted.blockchain}
              {...tokenBalanceConverted.token}
            />

            <LinearLayout flexGrow={1} flexShrink={1} marginLeft="16px">
              <TextView
                color="text.0"
                fontSize="xl"
                fontFamily="medium"
                numberOfLines={1}
                mb={showBlockchain ? '-5px' : undefined}
              >
                {tokenBalanceConverted.token.symbol}
              </TextView>

              {showBlockchain && (
                <TextView color="text.2" fontSize="sm" fontFamily="medium" numberOfLines={1}>
                  {i18n.t(`blockchainServices.${tokenBalanceConverted.blockchain}.id`)}
                </TextView>
              )}
            </LinearLayout>
          </LinearLayout>

          {showHoldingValue && (
            <LinearLayout alignItems="center">
              <TextView mb="-5px" color="text.2" fontSize="sm">
                {i18n.t('components.balanceList.holdings')}
              </TextView>

              <TextView color="text.2" fontSize="sm" fontWeight="500">
                {i18n.t('components.balanceList.value')}
              </TextView>
            </LinearLayout>
          )}

          <LinearLayout width="35%">
            <TextView color="text.0" fontSize="md" textAlign="right" numberOfLines={1} ellipsizeMode="tail">
              {String(tokenBalanceConverted.amount)}
            </TextView>

            <TextView
              color="primary"
              fontSize="md"
              fontFamily="medium"
              textAlign="right"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {FilterHelper.currency(tokenBalanceConverted.convertedAmount, currency, language)}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    )
  }
)

const BalanceList = ({
  hideEmptyMessage = false,
  orderByValue = true,
  onPress,
  showBlockchain,
  showHoldingValue,
  removeZeroBalance = true,
  balanceExchange,
  contentContainerStyle,
  hideTitle,
  ...props
}: Props) => {
  const { getTokenBySymbol } = useLocalTokensUtils()

  const validAndOrdedTokensBalances = useMemo(() => {
    const tokensBalancesConverted = BalanceHelper.convertBalancesToCurrency(
      balanceExchange.balance.data,
      balanceExchange.exchange.data
    )

    if (!tokensBalancesConverted) return

    let tokenBalances = tokensBalancesConverted

    if (removeZeroBalance) {
      tokenBalances = tokenBalances.filter(token => token.amountNumber > 0)
    }

    const mandatoryBlockchains = Object.keys(blockchainConfig.mandatorySymbols) as TBlockchainServiceKey[]

    mandatoryBlockchains.forEach(blockchainKey => {
      if (props.blockchainFilter && props.blockchainFilter !== blockchainKey) return

      blockchainConfig.mandatorySymbols[blockchainKey].forEach(symbol => {
        const balanceAlreadyExist = tokenBalances.some(
          balance => balance.token.symbol === symbol && balance.blockchain === blockchainKey
        )
        if (balanceAlreadyExist) return

        const token = getTokenBySymbol(symbol, blockchainKey)
        if (!token) return
        tokenBalances.push({
          amount: '0',
          amountNumber: 0,
          convertedAmount: 0,
          token,
          blockchain: blockchainKey,
        })
      })
    })

    if (orderByValue) {
      tokenBalances = tokenBalances.sort((prev, actual) => {
        if (prev.amount < actual.amount) {
          return 1
        }
        if (prev.amount > actual.amount) {
          return -1
        }
        return 0
      })
    }

    return tokenBalances
  }, [balanceExchange, getTokenBySymbol])

  return (
    <LinearLayout {...props} width="100%">
      <Skeleton
        isLoading={balanceExchange.isLoading}
        containerStyle={{ flexGrow: 1 }}
        layout={[
          { width: '100%', height: 48, marginVertical: 5 },
          { width: '100%', height: 48, marginVertical: 5 },
          { width: '100%', height: 48, marginVertical: 5 },
        ]}
      >
        <FlatList
          data={validAndOrdedTokensBalances}
          keyExtractor={item => item.token.hash}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !!validAndOrdedTokensBalances && validAndOrdedTokensBalances.length > 0 && !hideTitle ? (
              <TextView color="text.2" fontSize="sm">
                {i18n.t('components.balanceList.title')}
              </TextView>
            ) : undefined
          }
          ListEmptyComponent={
            !hideEmptyMessage ? (
              <TextView my="32px" color="text.0" fontSize="18px" textAlign="center">
                {i18n.t('components.balanceList.empty')}
              </TextView>
            ) : undefined
          }
          ItemSeparatorComponent={() => <LinearLayout bg="text.2" height={1} />}
          renderItem={({ item }) => (
            <BalanceListItem
              tokenBalanceConverted={item}
              showBlockchain={showBlockchain}
              showHoldingValue={showHoldingValue}
              onPress={onPress}
            />
          )}
        />
      </Skeleton>
    </LinearLayout>
  )
}

export default BalanceList
