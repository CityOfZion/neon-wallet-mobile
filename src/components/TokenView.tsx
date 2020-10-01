import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  transaction: SenderTransaction
  hideSingleTokenPrice?: boolean
}

export const TokenView = (props: Props) => {
  const {currency, language} = useSelector((state: RootState) => state.settings)

  return (
    <LinearLayout
      orientation={'verti'}
      borderRadius={'7px'}
      bg={'background.14'}
      pt={'12px'}
      pb={'12px'}
      pl={'16px'}
      pr={'16px'}
      mt={4}
    >
      <LinearLayout orientation={'horiz'}>
        <ImageView
          source={props.transaction.token?.srcIcon}
          width={'14px'}
          height={'14px'}
          alignSelf={'center'}
        />
        <TextView ml={'8px'} color={'text.0'} fontFamily={'medium'}>
          {props.transaction.token?.symbol}
        </TextView>
        <LinearLayout weight={1} />

        {!props.hideSingleTokenPrice && (
          <>
            <TextView fontFamily={'medium'} color={'text.0'}>
              {Facade.filter.currency(
                (props.transaction.token?.exchangeToken(currency) ?? 1) /
                  (props.transaction.token?.amount ?? 1),
                currency,
                language
              )}
            </TextView>
            <TextView
              ml={2}
              fontFamily={'medium'}
              color={'text.10'}
              fontSize={'12px'}
              textAlignVertical={'bottom'}
              includeFontPadding={false}
              mt={1}
            >
              1 {props.transaction.token?.symbol}
            </TextView>
          </>
        )}
      </LinearLayout>
      <LinearLayout orientation={'horiz'}>
        <HeaderColumn
          weight={2}
          title={Facade.t('transactionDetails.qty')}
          value={props.transaction.token?.amount.toFixed(8) ?? ''}
        />
        <HeaderColumn
          weight={1.6}
          title={Facade.t('transactionDetails.value')}
          value={Facade.filter.currency(
            props.transaction.token?.exchangeToken(currency),
            currency,
            language
          )}
          valueTextColor={'primary'}
        />
      </LinearLayout>
    </LinearLayout>
  )
}
