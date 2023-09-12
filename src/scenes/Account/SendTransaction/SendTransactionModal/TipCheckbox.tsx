import { Token } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { Account } from '~/src/store/account/Account'
import { LinearLayout } from '~/src/styles/styled-components'
import { TokenBalance } from '~/src/types/query'
import ThemedCheckBox from '~src/components/themed/ThemedCheckbox'

type Props = {
  tip?: number
  fee?: number
  amount?: number
  disabled: boolean
  checked: boolean
  onTipChange: (tip?: string) => void
  onDisableChange: (value: boolean) => void
  onCheckChange: (value: boolean) => void
  token?: Token
  account: Account
  tokenBalance?: TokenBalance
}

const PERCENTAGE = 1

export const TipCheckbox = ({
  tip,
  amount,
  fee,
  disabled,
  checked,
  onCheckChange,
  onDisableChange,
  onTipChange,
  token,
  account,
  tokenBalance,
}: Props) => {
  const tipConfig = blockchainConfig.mainnetTipByBlockchain[account.blockchain]
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  const handleOnPress = () => {
    if (checked) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.TipConfirmationModal.name,
        params: {
          onConfirmation: onCheckChange,
        },
      })
      return
    }

    onCheckChange(true)
  }

  useEffect(() => {
    if (!amount) {
      onTipChange()
      return
    }

    const newTip = (amount / 100) * PERCENTAGE

    if (onTipChange) {
      onTipChange(newTip.toFixed(tipConfig?.token.decimals))
    }
  }, [amount])

  useEffect(() => {
    if (!token || !amount || fee === undefined || !tip || !tokenBalance) {
      onDisableChange(true)
      return
    }

    if (tipConfig && token.symbol === tipConfig.token.symbol) {
      if (tokenBalance.amountNumber >= tip + amount + fee) {
        onDisableChange(false)
        return
      }

      onDisableChange(true)
      return
    }

    if (tokenBalance.amountNumber - fee >= tip) {
      onDisableChange(false)
      return
    }

    onDisableChange(true)
  }, [token, tip, amount, fee, tokenBalance])

  return (
    <LinearLayout mt={30}>
      <ThemedCheckBox
        label={i18n.t('modals.sendTransactionModal.tipCheckboxLabel', {
          tipValue: tip ?? '0',
        })}
        checked={disabled ? false : checked}
        onPress={handleOnPress}
        disabled={disabled}
      />
    </LinearLayout>
  )
}
