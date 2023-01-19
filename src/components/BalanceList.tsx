import i18n from 'i18n-js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { blockchainList, blockchainServices, hasIconDapps, IToken, mappedTokensBySymbol } from '../blockchain/common'
import { BalanceConvertedToExchange, BalanceHelper } from '../helpers/BalanceHelper'
import { TokenHelper } from '../helpers/TokenHelper'
import { useTokens } from '../hooks/useTokens'
import { RootState } from '../store/RootStore'
import { UseBalanceExchangeResult, TokenBalance } from '../types/query'
import { LinearLayoutProps } from '../types/styled-components'
import { Skeleton } from './Skeleton'

import { FilterHelper } from '~src/helpers/FilterHelper'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface BalanceListItemProps {
  onPress?: () => void
  tokenBalanceConverted: BalanceConvertedToExchange
  showBlockchain?: boolean
  showHoldingValue?: boolean
}

interface Props extends LinearLayoutProps {
  balanceExchange: UseBalanceExchangeResult
  hideEmptyMessage?: boolean
  removeZeroBalance?: boolean
  orderByValue?: boolean
  showBlockchain?: boolean
  showHoldingValue?: boolean
  onPress?: (token: TokenBalance) => void
}

const BalanceListItem = React.memo(
  ({ showBlockchain = false, showHoldingValue = true, onPress, tokenBalanceConverted }: BalanceListItemProps) => {
    const language = useSelector((state: RootState) => state.settings.language)
    const currency = useSelector((state: RootState) => state.settings.currency)

    const handlePress = () => {
      if (onPress) onPress()
    }

    const image =
      tokenBalanceConverted.icon ?? TokenHelper.getIcon(tokenBalanceConverted.symbol, tokenBalanceConverted.blockchain)

    return (
      <ButtonView onPress={handlePress}>
        <LinearLayout orientation="horiz" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
          <LinearLayout orientation="horiz" alignItems="center" width="100px">
            <ImageView
              mr="8px"
              resizeMode="contain"
              alignSelf="center"
              source={image}
              style={{
                width: 24,
                height: 24,
              }}
            />

            <LinearLayout>
              <TextView
                color="text.0"
                fontSize="xl"
                fontFamily="medium"
                numberOfLines={1}
                mb={showBlockchain ? '-5px' : undefined}
              >
                {tokenBalanceConverted.symbol}
              </TextView>

              {showBlockchain && (
                <TextView color="text.2" fontSize="sm" fontFamily="medium" numberOfLines={1}>
                  {i18n.t(`blockchainServices.${tokenBalanceConverted.blockchain}.id`)}
                </TextView>
              )}
            </LinearLayout>
          </LinearLayout>

          {showHoldingValue && (
            <LinearLayout>
              <LinearLayout justifyContent="center">
                <TextView
                  mb="-6px"
                  color="text.2"
                  fontSize="sm"
                  allowFontScaling
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  mr={4}
                >
                  {i18n.t('components.balanceList.holdings')}
                </TextView>
                <TextView
                  mt={1}
                  color="text.2"
                  fontSize="sm"
                  fontFamily="medium"
                  allowFontScaling
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {i18n.t('components.balanceList.value')}
                </TextView>
              </LinearLayout>
            </LinearLayout>
          )}

          <LinearLayout width="80px">
            <TextView
              color="text.0"
              fontSize="md"
              allowFontScaling
              numberOfLines={1}
              ellipsizeMode="tail"
              textAlign="right"
            >
              {String(tokenBalanceConverted.amount)}
            </TextView>
            <TextView
              color="primary"
              fontSize="md"
              fontFamily="medium"
              ellipsizeMode="tail"
              numberOfLines={1}
              textAlign="right"
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
  ...props
}: Props) => {
  const { getTokenBySymbol } = useTokens({ blockchain: 'all' })
  const mandatorySymbols: Record<BlockchainServiceKey, { [symbol: string]: string }> = {
    neo3: {
      NEO: `NEO`,
      GAS: `GAS`,
      FLM: `FLM`,
      GM: 'GM',
      fUSDT: `fUSDT`,
      bNEO: `bNEO`,
      fWBTC: `fWBTC`,
    },
    neoLegacy: {},
  }

  const populateMandatoryTokens = useCallback(
    (tokenBalances: BalanceConvertedToExchange[]) => {
      tokenBalances.forEach(({ blockchain }) => {
        const mandatorySymbolByBlockchain = Object.values(mandatorySymbols[blockchain])
        const missingMandatoryTokens = mandatorySymbolByBlockchain.filter(
          symbol => !tokenBalances.some(token => token.symbol === symbol)
        )
        const mandatoryTokens = missingMandatoryTokens
          .map(symbol => getTokenBySymbol(symbol))
          .filter(token => token !== undefined) as IToken[]
        mandatoryTokens.forEach(token => {
          tokenBalances.push({
            amount: 0,
            blockchain: token.blockchain,
            convertedAmount: 0,
            hash: token.hash,
            name: token.name,
            symbol: token.symbol,
          })
        })
      })
      if (tokenBalances.length < 1) {
        blockchainList.forEach(blockchain => {
          const mandatorySymbolByBlockchain = Object.values(mandatorySymbols[blockchain])
          const mandatoryTokens = mandatorySymbolByBlockchain
            .map(symbol => getTokenBySymbol(symbol))
            .filter(token => token !== undefined) as IToken[]
          const rulesToPopulate: boolean[] = [mandatorySymbolByBlockchain.length > 0]
          if (rulesToPopulate.every(rule => rule === true)) {
            mandatoryTokens.forEach(token => {
              tokenBalances.push({
                amount: 0,
                blockchain: token.blockchain,
                convertedAmount: 0,
                hash: token.hash,
                name: token.name,
                symbol: token.symbol,
              })
            })
          }
        })
      }
      return tokenBalances
    },
    [mandatorySymbols, getTokenBySymbol]
  )

  const tokensBalancesConverted = useMemo(
    () => BalanceHelper.convertBalancesToCurrency(balanceExchange.balance.data, balanceExchange.exchange.data),
    [balanceExchange]
  )

  const validAndOrdedTokensBalances = useMemo(() => {
    if (!tokensBalancesConverted) return

    let tokenBalances = tokensBalancesConverted

    if (removeZeroBalance) {
      tokenBalances = tokenBalances.filter(token => token.amount > 0)
    }

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

    return populateMandatoryTokens(tokenBalances)
  }, [tokensBalancesConverted])

  const handlePress = (token: TokenBalance) => {
    if (onPress) onPress(token)
  }

  const populateIcons = useCallback(async () => {
    if (validAndOrdedTokensBalances && validAndOrdedTokensBalances[0]) {
      const service = blockchainServices[validAndOrdedTokensBalances[0].blockchain]
      if (hasIconDapps(service)) {
        const icons = await service.getIconList(validAndOrdedTokensBalances.map(it => it.hash))
        validAndOrdedTokensBalances.forEach(it => {
          it.icon = icons.get(it.hash)?.sm
        })
      }
    }
  }, [validAndOrdedTokensBalances])

  useEffect(() => {
    populateIcons()
  }, [validAndOrdedTokensBalances])

  return (
    <LinearLayout {...props} width="100%">
      <Skeleton
        isLoading={balanceExchange.isLoading}
        layout={[
          { width: '100%', height: 48, marginVertical: 5 },
          { width: '100%', height: 48, marginVertical: 5 },
          { width: '100%', height: 48, marginVertical: 5 },
        ]}
      >
        <FlatList
          data={validAndOrdedTokensBalances}
          keyExtractor={item => item.hash}
          ListHeaderComponent={
            !!validAndOrdedTokensBalances && validAndOrdedTokensBalances.length > 0 ? (
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
              onPress={() => handlePress(item)}
            />
          )}
        />
      </Skeleton>
    </LinearLayout>
  )
}

export default BalanceList
