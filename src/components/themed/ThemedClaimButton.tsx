import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useCallback} from 'react'
import {
  StyleSheet,
  GestureResponderEvent,
  Platform,
  ImageLoadEventData,
  Dimensions,
} from 'react-native'
import {useSelector} from 'react-redux'

import ThemedButton from './ThemedButton'

import {FilterHelper} from '~/src/helpers/FilterHelper'
import {
  RelativeLayout,
  LinearLayout,
  TextView,
  ImageView,
} from '~/src/styles/styled-components'

interface Props {
  onPress: (evt: GestureResponderEvent) => void
  isClaimAvailable: boolean
  unclaimedGasAmount: number
  fee: number | null
}

const ThemedClaimButton: React.FC<Props> = (props) => {
  const gradientButton =
    Platform.OS === 'android'
      ? ['#464c52', '#1c2329']
      : ['#1c232999', '#464c52BB']
  const gradientEnd = [0.1, 0.8]
  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get('window').width * 0.49,
      height: 45,
      borderRadius: 7,
      shadowColor: '#464d53',
      shadowOffset: {
        width: 12,
        height: 12,
      },
      shadowRadius: 7,
      elevation: 30,
    },
  })
  const {language} = useSelector((state: RootState) => state.settings)
  const [infoClaim, setInfoClaim] = useState<{
    textColor: string
    text: string
    opacity: number
    icon?: ImageLoadEventData
  }>()

  const handleInfoClaim = useCallback(() => {
    if (props.unclaimedGasAmount <= 0 || props.fee === null) {
      setInfoClaim({
        text: i18n.t('screens.getAccount.gasUnavailable'),
        textColor: 'text.2',
        opacity: 0.6,
      })
    } else if (props.fee < props.unclaimedGasAmount) {
      setInfoClaim({
        text: i18n.t('screens.getAccount.claimAsset', {
          amount: FilterHelper.decimal(props.unclaimedGasAmount, language, 8),
        }),
        textColor: 'primary',
        opacity: 1,
      })
    } else {
      setInfoClaim({
        text: i18n.t('screens.getAccount.claimAsset', {
          amount: FilterHelper.decimal(props.unclaimedGasAmount, language, 8),
        }),
        textColor: '#d355e7',
        opacity: 1,
        icon: require('~src/assets/images/icon-warning-purple.png'),
      })
    }
  }, [props.unclaimedGasAmount, props.fee, props.isClaimAvailable])

  useEffect(() => {
    handleInfoClaim()
  }, [props.isClaimAvailable])
  return (
    <ThemedButton
      height={45}
      onPress={props.onPress}
      srcIcon={infoClaim?.icon}
      label={infoClaim?.text}
      width={Dimensions.get('window').width * 0.5}
      fontSize={'15px'}
      labelPx={2}
      adjustsFontSizeToFit={false}
      iconSize={!props.isClaimAvailable ? [10, 10] : [20, 20]}
      textColor={
        infoClaim?.icon
          ? props.isClaimAvailable
            ? infoClaim.textColor
            : undefined
          : '#ffffff99'
      }
      iconAlignX="flex-end"
      labelWidth="100%"
      disabled={!props.isClaimAvailable}
    ></ThemedButton>
  )
}

ThemedClaimButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isClaimAvailable: PropTypes.bool.isRequired,
  unclaimedGasAmount: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
}

export {ThemedClaimButton}
