import I18n from 'i18n-js'
import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey } from '~/src/blockchain'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { Currency } from '~/src/enums/Currency'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { TokenAsset } from '~/src/models/TokenAsset'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView, ButtonView, ImageView } from '~/src/styles/styled-components'

const AmountField = (props: {
  validatorAmount: (val: string) => boolean
  validatorFiat: (val: string) => boolean
  onAmountChanged: (amount: string) => void
  onFiatChanged: (fiat: string) => void
  token: TokenAsset | null | undefined
  amount: number | string
  fiat: number | string
  setAmount: (amount: number) => void
  setFiat: (fiat: number) => void
  setFieldTyping: (typingField: string) => void
  tokenBalance: number
  remainingTokenBalance: number
  account: Account
  currency: Currency
}) => {
  const [tokenDecimalPlaces, setTokenDecimalPlaces] = useState<number | null>()

  const setValue = useCallback(
    (val: string, roundDown?: boolean) => {
      let valueNumber
      if (roundDown) {
        valueNumber = Math.floor(Number(val))
      } else valueNumber = Number(val)

      if (!valueNumber) return

      val = val.replace(',', '.')
      if (tokenDecimalPlaces !== undefined && tokenDecimalPlaces !== null && tokenDecimalPlaces < 1)
        val = val.replace('.', '')

      props.setAmount(Number(val))
    },
    [tokenDecimalPlaces]
  )

  const { language } = useSelector((state: RootState) => state.settings)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { tokens } = useSelector((state: RootState) => state.app)

  const getDecimals = useCallback(
    async (tokenSymbol: string, blockchain: BlockchainServiceKey) => {
      return tokens.find(it => it.symbol === tokenSymbol && it.blockchain === blockchain)?.decimals
    },
    [props.token]
  )

  useEffect(() => {
    if (props.token) {
      getDecimals(props.token.symbol, props.token.blockchain).then(result => {
        setTokenDecimalPlaces(result)
      })
    }
  }, [props.token])

  return (
    <>
      <LinearLayout orientation="horiz" justifyContent="space-between" mt={30} mb={20}>
        <LinearLayout weight={2}>
          <InputLabel title={I18n.t('modals.send.transactionInput.amount')} color="text.0" capitalize />
        </LinearLayout>
        <LinearLayout orientation="horiz" alignItems="center">
          <TextView mr="6px" color="text.10">
            {I18n.t('modals.send.transactionInput.totalAfterTransaction')}
          </TextView>
          <TextView color="text.0" fontFamily="bold" fontSize="16px">
            {props.remainingTokenBalance >= 0 ? FilterHelper.decimal(props.remainingTokenBalance, language) : '-'}
          </TextView>
        </LinearLayout>
        <ButtonView
          p="8px"
          onPress={() => {
            props.setFieldTyping('amountField')
            setValue(String(props.tokenBalance))
          }}
        >
          <TextView color="primary" fontSize="15px" fontFamily="medium">
            {I18n.t('modals.send.transactionInput.max')}
          </TextView>
        </ButtonView>
      </LinearLayout>
      <LinearLayout position="relative" orientation="horiz" justifyContent="space-between">
        <LinearLayout width="50%">
          <InputWithValidation
            onFocus={() => props.setFieldTyping('amountField')}
            onChangeText={val => props.onAmountChanged(val)}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.text[10]}
            invalidMessageColor={theme.colors.quinary}
            value={props.amount !== null ? String(props.amount) : ''}
            placeholder={I18n.t('modals.send.transactionInput.enterValue', {
              value: props.token ? props.token.symbol : 'Token',
            })}
            validator={val => props.validatorAmount(val)}
            invalidMessage={I18n.t('modals.send.transactionInput.insufficientFunds')}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste
            hideScan
            keyboardType="numeric"
            editable={Boolean(props.token)}
          />
        </LinearLayout>
        <LinearLayout width="45%">
          <LinearLayout height="50px" orientation="horiz">
            <TextView color="white" fontSize="20px" fontFamily="medium" mr={5}>
              {`${props.currency}:`}
            </TextView>
            <InputWithValidation
              onFocus={() => props.setFieldTyping('fiatField')}
              onChangeText={val => props.onFiatChanged(val)}
              color={theme.colors.text[0]}
              invalidColor={theme.colors.text[10]}
              invalidMessageColor={theme.colors.quinary}
              value={props.fiat !== '' ? String(props.fiat) : ''}
              placeholder={I18n.t('modals.send.transactionInput.enterValue', {
                value: props.currency,
              })}
              validator={() => true}
              invalidMessage={I18n.t('modals.send.transactionInput.insufficientFunds')}
              separatorColor={theme.colors.background[13]}
              sideMargins={0}
              hidePaste
              hideScan
              keyboardType="numeric"
              editable={!!tokenDecimalPlaces}
            />
          </LinearLayout>
          <ButtonView
            mt={2}
            alignSelf="flex-end"
            onPress={() => {
              props.setFieldTyping('fiatField')
              props.setFiat(Math.floor(Number(props.fiat)))
            }}
          >
            <LinearLayout orientation="horiz">
              <ImageView
                mr="3"
                alignSelf="center"
                source={require('~src/assets/images/round-down-arrows.png')}
                resizeMode="contain"
              />
              <TextView color="primary" fontSize="15px" fontFamily="medium" mb="2">
                {I18n.t('modals.send.transactionInput.roundDown')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        </LinearLayout>
      </LinearLayout>
    </>
  )
}

export default AmountField
