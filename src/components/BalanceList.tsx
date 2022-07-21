import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { BalanceConvertedToExchange, BalanceHelper } from '../helpers/BalanceHelper'
import { TokenHelper } from '../helpers/TokenHelper'
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

    return (
      <ButtonView onPress={handlePress}>
        <LinearLayout orientation="horiz" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
          <LinearLayout orientation="horiz" alignItems="center" width="100px">
            {showBlockchain ? (
              <LinearLayout
                mr="8px"
                width={12}
                height={12}
                borderRadius={6}
                backgroundColor={TokenHelper.getColor(tokenBalanceConverted.hash)}
                alignSelf="center"
              />
            ) : (
              <ImageView
                mr="8px"
                resizeMode="contain"
                alignSelf="center"
                source={TokenHelper.getIcon(tokenBalanceConverted.symbol, tokenBalanceConverted.blockchain)}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            )}

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

    return tokenBalances
  }, [tokensBalancesConverted])

  const handlePress = (token: TokenBalance) => {
    if (onPress) onPress(token)
  }

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
