import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { BalanceConvertedToExchange, BalanceHelper } from '../helpers/BalanceHelper'
import { TokenHelper } from '../helpers/TokenHelper'
import { RootState } from '../store/RootStore'
import { Balance, TokenBalance } from '../types/balance'
import { MultiExchange } from '../types/exchange'
import { LinearLayoutProps } from '../types/styled-components'

import { Normalize } from '~src/app/Normalize'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface BalanceListItemProps {
  onPress?: () => void
  tokenBalanceConverted: BalanceConvertedToExchange
  showBlockchain?: boolean
  showHoldingValue?: boolean
}

interface Props extends LinearLayoutProps {
  balances?: Balance | Balance[]
  exchange?: MultiExchange
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
                width={Normalize.scale(24)}
                height={Normalize.scale(24)}
                resizeMode="contain"
                alignSelf="center"
                source={TokenHelper.getIcon(tokenBalanceConverted.symbol, tokenBalanceConverted.blockchain)}
              />
            )}

            <LinearLayout>
              <TextView
                color="text.0"
                fontSize="xl"
                fontFamily="medium"
                allowFontScaling
                adjustsFontSizeToFit
                numberOfLines={1}
                mb={showBlockchain ? '-5px' : undefined}
              >
                {tokenBalanceConverted.symbol}
              </TextView>

              {showBlockchain && (
                <TextView
                  color="text.2"
                  fontSize="sm"
                  fontFamily="medium"
                  allowFontScaling
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
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
  balances,
  hideEmptyMessage = false,
  orderByValue = true,
  onPress,
  showBlockchain,
  showHoldingValue,
  removeZeroBalance = true,
  exchange,
  ...props
}: Props) => {
  const tokensBalancesConverted = useMemo(
    () => BalanceHelper.convertBalancesToCurrency(balances, exchange),
    [balances, exchange]
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
  }, [balances])

  const handlePress = (token: TokenBalance) => {
    if (onPress) onPress(token)
  }

  return (
    <LinearLayout {...props} width="100%">
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
    </LinearLayout>
  )
}

export default BalanceList
