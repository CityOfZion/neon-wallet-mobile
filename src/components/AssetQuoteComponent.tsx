import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { Exchange } from '../types/exchange'
import SkeletonContainer from './SkeletonContainer'

import { Normalize } from '~src/app/Normalize'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  token: TokenAsset
  exchange?: Exchange
}

const AssetQuoteComponent: React.FC<Props> = props => {
  const { exchange } = props
  const { language, currency } = useSelector((state: RootState) => state.settings)
  const [ratio, setRatio] = useState<number | null>(null)
  const amountExchanged = props.token.exchangeToken(currency, exchange)

  const quoteText = ratio
    ? `${props.token.symbol} 1 = ${FilterHelper.currencyExtendedMaxLimit(ratio, currency, language)}`
    : ''

  const valueText = FilterHelper.currency(amountExchanged, currency, language)

  const calcRatio = () => {
    if (exchange) {
      setRatio(props.token.getCurrencyRatio(currency, exchange))
    }
  }

  useEffect(() => {
    calcRatio()
  }, [exchange])

  return (
    <LinearLayout orientation="horiz" width="100%" alignItems="center">
      <ImageView
        mr={4}
        width={Normalize.scale(32)}
        height={Normalize.scale(32)}
        resizeMode="contain"
        source={props.token.srcIcon}
      />

      <LinearLayout weight={1} mr={4} orientation="verti">
        <TextView
          fontFamily="bold"
          fontSize="2xl"
          color="white"
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {props.token.name}
        </TextView>

        <TextView
          mb={-1}
          fontFamily="medium"
          fontSize={12}
          color="text.2"
          textAlign="left"
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {props.token.symbol}
        </TextView>
      </LinearLayout>

      <LinearLayout alignItems="flex-end">
        <SkeletonContainer isLoading={!exchange} skeletonType="assetDetail">
          <LinearLayout alignItems="flex-end">
            <TextView
              mb={-1}
              fontFamily="medium"
              fontSize="md"
              color="text.2"
              numberOfLines={1}
              allowFontScaling
              adjustsFontSizeToFit
            >
              {valueText}
            </TextView>
            <TextView
              fontFamily="medium"
              fontSize="lg"
              color="text.0"
              numberOfLines={1}
              allowFontScaling
              adjustsFontSizeToFit
            >
              {quoteText}
            </TextView>
          </LinearLayout>
        </SkeletonContainer>
      </LinearLayout>
    </LinearLayout>
  )
}

AssetQuoteComponent.propTypes = {
  token: PropTypes.instanceOf(TokenAsset).isRequired,
}

export default AssetQuoteComponent;
