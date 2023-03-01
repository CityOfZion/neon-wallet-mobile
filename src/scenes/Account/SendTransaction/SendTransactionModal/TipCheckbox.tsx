import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { Token } from '~/src/models/Token'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { LinearLayout } from '~/src/styles/styled-components'
import { TokenBalance } from '~/src/types/query'
import ThemedCheckBox from '~src/components/themed/ThemedCheckbox'

type Props = {
  tip?: number
  fee?: number
  amount?: number
  disabled: boolean
  checked: boolean
  onTipChange: (tip?: number) => void
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
  const { blockchainService } = useBlockchainService(account.blockchain)

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
      onTipChange(newTip)
    }
  }, [amount])

  useEffect(() => {
    if (!token || !amount || fee === undefined || !tip || !tokenBalance || !blockchainService.cozTip) {
      onDisableChange(true)
      return
    }

    if (token.symbol === blockchainService.cozTip.symbol) {
      if (tokenBalance.amount >= tip + amount + fee) {
        onDisableChange(false)
        return
      }

      onDisableChange(true)
      return
    }

    if (tokenBalance.amount - fee >= tip) {
      onDisableChange(false)
      return
    }

    onDisableChange(true)
  }, [token, tip, amount, fee, tokenBalance])

  return (
    <LinearLayout mt={30}>
      <ThemedCheckBox
        label={i18n.t('modals.sendTransactionModal.tipCheckboxLabel', {
          tipValue: tip ? tip.toFixed(8) : '0',
        })}
        checked={disabled ? false : checked}
        onPress={handleOnPress}
        disabled={disabled}
      />
    </LinearLayout>
  )
}
