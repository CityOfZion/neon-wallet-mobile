import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { Exchange } from '../types/exchange'
import { LinearLayoutProps } from '../types/styled-components'

import { Normalize } from '~src/app/Normalize'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface ViewBalanceItemProps {
  token: TokenAsset
  showBlockchain?: boolean
  showHoldingValue?: boolean
}

interface BalanceListItemProps extends ViewBalanceItemProps {
  onPress?: (token: TokenAsset) => void
  exchange?: Exchange
}

interface Props extends Omit<BalanceListItemProps, 'token'>, LinearLayoutProps {
  tokenAssets: TokenAsset[]
  hideEmptyMessage?: boolean
  removeZeroBalance?: boolean
  orderByValue?: boolean
}

const BalanceListItem = ({
  showBlockchain = false,
  showHoldingValue = true,
  onPress,
  token,
  exchange,
}: BalanceListItemProps) => {
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)

  const handlePress = () => {
    if (onPress) {
      onPress(token)
    }
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearLayout orientation="horiz" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
        <LinearLayout orientation="horiz" alignItems="center" width="100px">
          {showBlockchain ? (
            <LinearLayout
              mr="8px"
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor={token.color}
              alignSelf="center"
            />
          ) : (
            <ImageView
              mr="8px"
              width={Normalize.scale(24)}
              height={Normalize.scale(24)}
              resizeMode="contain"
              alignSelf="center"
              source={token.srcIcon}
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
              {token.symbol}
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
                {i18n.t(`blockchainServices.${token.blockchain}.id`)}
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
            {String(token.amount)}
          </TextView>
          <TextView
            color="primary"
            fontSize="md"
            fontFamily="medium"
            ellipsizeMode="tail"
            numberOfLines={1}
            textAlign="right"
          >
            {FilterHelper.currency(token.exchangeToken(currency, exchange), currency, language)}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </TouchableOpacity>
  )
}

const BalanceList = ({
  tokenAssets,
  hideEmptyMessage = false,
  orderByValue = true,
  onPress,
  showBlockchain,
  showHoldingValue,
  removeZeroBalance = true,
  exchange,
  ...props
}: Props) => {
  const validAndOrdedTokens = useMemo(() => {
    const allTokens = tokenAssets

    if (removeZeroBalance) {
      allTokens.filter(token => token.amount > 0)
    }

    if (orderByValue) {
      allTokens.sort((token1, token2) => {
        if (token1.amount < token2.amount) {
          return 1
        }
        if (token1.amount > token2.amount) {
          return -1
        }
        return 0
      })
    }

    return allTokens
  }, [tokenAssets])

  return (
    <LinearLayout {...props} width="100%">
      <FlatList
        data={validAndOrdedTokens}
        keyExtractor={item => item.hash}
        ListHeaderComponent={
          validAndOrdedTokens.length > 0 ? (
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
            exchange={exchange}
            token={item}
            showBlockchain={showBlockchain}
            showHoldingValue={showHoldingValue}
            onPress={onPress}
          />
        )}
      />
    </LinearLayout>
  )
}

export default BalanceList
