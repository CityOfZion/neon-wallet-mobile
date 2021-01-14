import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import ThemedCheckBox from '~src/components/themed/ThemedCheckbox'

interface ITipCheckbox {
  label: string
  gasAmount?: number
  fiat: number
  dispatchTip: React.Dispatch<
    React.SetStateAction<{amount: number; address: string} | undefined>
  >
  percentage?: number
  address: string
  mainAsset?: string
  feeAmount?: number
}

export const TipCheckbox: React.FC<ITipCheckbox> = ({
  gasAmount,
  fiat,
  label,
  percentage,
  address,
  mainAsset,
  feeAmount,
  dispatchTip,
}) => {
  const [visible, setVisible] = useState(false)
  const [tip, setTip] = useState<{amount: number; address: string} | undefined>(
    undefined
  )

  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)
  const isVisible = () => {
    const tipValue = (fiat / 100) * (percentage ?? 0.3) //by pattern, the value is 0.3%
    const gasValue = exchange['GAS'].to[currency] * (gasAmount ? gasAmount : 0)
    const feeValue = exchange['GAS'].to[currency] * (feeAmount ? feeAmount : 0)
    if (
      (gasValue >= tipValue && fiat > 0 && mainAsset !== 'GAS') ||
      (mainAsset === 'GAS' && gasValue >= fiat + tipValue + feeValue)
    ) {
      setVisible(true)
    } else {
      setVisible(false)
      setTip(undefined)
    }
  }
  const calcTip = (checked: boolean) => {
    if (!checked) {
      setTip(undefined)
    } else {
      const tipValue = (fiat / 100) * (percentage ?? 0.1)
      if (tip === undefined) {
        setTip({address, amount: tipValue})
      } else if (tip) {
        tip.amount !== tipValue && setTip({address, amount: tipValue})
      }
    }
  }
  useEffect(() => {
    isVisible()
  }, [fiat])
  useEffect(() => {
    dispatchTip(tip)
  }, [tip])
  return visible ? (
    <ThemedCheckBox
      label={label}
      onChange={(check) => {
        calcTip(check)
      }}
      labelStyle={{
        color: 'primary',
        size: 14,
        numberOfLines: 3,
        marginVertical: 8,
        marginHorizontal: 4,
      }}
    />
  ) : (
    <></>
  )
}
TipCheckbox.propTypes = {
  gasAmount: PropTypes.number,
  fiat: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  address: PropTypes.string.isRequired,
  mainAsset: PropTypes.string,
  feeAmount: PropTypes.number,
  dispatchTip: PropTypes.func.isRequired,
}
