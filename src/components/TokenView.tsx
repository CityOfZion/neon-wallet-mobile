import PropTypes from 'prop-types'
import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
interface Props {
  transaction: SenderTransactionState
  hideSingleTokenPrice?: boolean
  widthIcon?: string
  heightIcon?: string
  hideTokenInWallet?: boolean
  hideAmountAbove?: boolean
}

export const TokenView = (props: Props) => {
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)

  const getValueToken = () => {
    if (props.transaction.token) {
      const ratio =
        exchange[props.transaction.token?.symbol]?.to[currency] ?? null
      if (ratio && props.transaction.fiat) {
        return (props.transaction.fiat / ratio).toFixed(2)
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  const renderTokenValues = () => {
    return props.transaction.tokens.length > 0 ? (
      props.transaction.tokens.map((token, index) => (
        <>
          <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
            <LinearLayout orientation={'horiz'} weight={1}>
              <ImageView
                source={token?.srcIcon}
                width={props.widthIcon ?? '17px'}
                height={props.heightIcon ?? '17px'}
                alignSelf={'center'}
              />
              <TextView
                ml={'8px'}
                color={'text.0'}
                fontFamily={'medium'}
                fontSize={'16px'}
              >
                {token?.symbol}
              </TextView>
            </LinearLayout>
            {!props.hideTokenInWallet && (
              <TextView color="text.10" mr={3}>
                {`${token?.amount} ${token?.name} in Wallet`}
              </TextView>
            )}

            {!props.hideSingleTokenPrice && (
              <>
                <TextView
                  fontFamily={'medium'}
                  fontSize={'16px'}
                  color={'text.0'}
                  mr={2}
                >
                  {Facade.filter.currency(
                    (token?.exchangeToken(currency) ?? 1) /
                      (token?.amount ?? 1),
                    currency,
                    language
                  )}
                </TextView>
                <TextView
                  ml={2}
                  mr={4}
                  fontFamily={'medium'}
                  color={'text.10'}
                  fontSize={'12px'}
                  textAlignVertical={'bottom'}
                  includeFontPadding={false}
                  mt={1}
                >
                  1 {token?.symbol}
                </TextView>
              </>
            )}
          </LinearLayout>
          <LinearLayout orientation={'horiz'}>
            <HeaderColumn
              weight={2}
              title={Facade.t('transactionDetails.qty')}
              value={token?.amount.toFixed(8) ?? ''}
            />
            <HeaderColumn
              weight={1.6}
              title={Facade.t('transactionDetails.value')}
              value={Facade.filter.currency(
                token.exchangeToken(currency),
                currency,
                language,
                2,
                4
              )}
              valueTextColor={'primary'}
            />
          </LinearLayout>
          {index < props.transaction.tokens.length - 1 && (
            <LinearLayout
              opacity={0.5}
              borderColor={'text.2'}
              borderWidth={'0.5px'}
              borderStyle={'dashed'}
              height={'1px'}
              style={{marginVertical: 5}}
            />
          )}
        </>
      ))
    ) : (
      <>
        <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
          <LinearLayout orientation={'horiz'} weight={1}>
            <ImageView
              source={props.transaction.token?.srcIcon}
              width={props.widthIcon ?? '17px'}
              height={props.heightIcon ?? '17px'}
              alignSelf={'center'}
            />
            <TextView
              ml={'8px'}
              color={'text.0'}
              fontFamily={'medium'}
              fontSize={'16px'}
            >
              {props.transaction.token?.symbol}
            </TextView>
          </LinearLayout>
          {!props.hideTokenInWallet && (
            <TextView color="text.10" mr={3}>
              {`${props.transaction.token?.amount} ${props.transaction.token?.name} in Wallet`}
            </TextView>
          )}

          {!props.hideSingleTokenPrice && (
            <>
              <TextView
                fontFamily={'medium'}
                fontSize={'16px'}
                color={'text.0'}
                mr={2}
              >
                {Facade.filter.currency(
                  (props.transaction.token?.exchangeToken(currency) ?? 1) /
                    (props.transaction.token?.amount ?? 1),
                  currency,
                  language
                )}
              </TextView>
              <TextView
                ml={2}
                mr={4}
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
              props.transaction.fiat ??
                (
                  exchange[props.transaction.tokens[0].symbol].to[currency] *
                  props.transaction.tokens[0].amount
                ).toFixed(8),
              currency,
              language
            )}
            valueTextColor={'primary'}
          />
        </LinearLayout>
      </>
    )
  }

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
      {renderTokenValues()}
      <LinearLayout orientation={'horiz'}>
        <HeaderColumn
          weight={2.75}
          title={Facade.t('transactionDetails.priorityFee')}
          value={[
            {
              value: props.transaction.feeAmount?.name.toUpperCase(),
              color: 'primary',
            },
            {
              value: props.transaction.feeAmount?.fee.toString(),
              color: 'text.10',
            },
            {
              value: 'GAS',
              color: 'text.10',
            },
          ]}
        />
        {!props.hideAmountAbove && (
          <HeaderColumn
            weight={2.2}
            title={Facade.t('transactionDetails.amount')}
            value={[
              {
                value: `${getValueToken()}`,
              },
              {
                value: `1${props.transaction.token?.symbol}`,
                color: 'text.0',
                size: 12,
              },
            ]}
          />
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

interface ITipView {
  amount: number
  widthIcon?: string
  heightIcon?: string
}

export const TipView: React.FC<ITipView> = (props) => {
  const tokens = useSelector((state: RootState) => state.app.tokens)
  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)
  const ratioTip = exchange['GAS'].to[currency] * props.amount
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
      <TextView mb={'5px'} color={'text.10'}>
        Tip
      </TextView>
      <LinearLayout orientation={'horiz'}>
        <ImageView
          source={
            tokens.find(
              (token) => token.symbol === 'GAS' && token.name === 'GAS'
            )?.srcIcon
          }
          width={props.widthIcon ?? '14px'}
          height={props.heightIcon ?? '14px'}
          alignSelf={'center'}
        />
        <TextView
          ml={3}
          fontFamily={'medium'}
          color={'text.0'}
          fontSize={'12px'}
          textAlignVertical={'bottom'}
          includeFontPadding={false}
        >
          {
            tokens.find(
              (token) => token.symbol === 'GAS' && token.name === 'GAS'
            )?.symbol
          }
        </TextView>
      </LinearLayout>
      <LinearLayout style={{width: 275}} alignSelf={'flex-start'}>
        <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
          <LinearLayout orientation={'verti'}>
            <TextView color={'text.10'}>qty</TextView>
            <TextView color={'text.0'}>{props.amount.toFixed(8)}</TextView>
          </LinearLayout>
          <LinearLayout orientation={'verti'}>
            <TextView color={'text.10'}>value</TextView>
            <TextView color={'text.0'}>{`$${ratioTip.toFixed(8)}`}</TextView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

TipView.propTypes = {
  amount: PropTypes.number.isRequired,
  heightIcon: PropTypes.string,
  widthIcon: PropTypes.string,
}
