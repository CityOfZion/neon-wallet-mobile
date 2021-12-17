import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useState, useEffect, useCallback} from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  GestureResponderEvent,
  View,
  Platform,
  ImageLoadEventData,
} from 'react-native'
import {useSelector} from 'react-redux'

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
      width: 209,
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
    <TouchableWithoutFeedback
      onPress={props.isClaimAvailable ? props.onPress : undefined}
    >
      <View style={styles.dropShadow}>
        <RelativeLayout
          width={'100%'}
          height={'100%'}
          alignItems="center"
          justifyContent="center"
          borderRadius={7}
        >
          <LinearLayout
            width="100%"
            height="100%"
            borderRadius={7}
            overflow="hidden"
            position="absolute"
          >
            <LinearLayout width="100%" height="100%" bg={'#1c2329'} />
          </LinearLayout>
          <LinearLayout
            width="98%"
            height="98%"
            borderRadius={7}
            overflow="hidden"
            justifyContent={'center'}
            bg={props.isClaimAvailable ? '#41515b' : '#313e46'}
            style={{borderRadius: 7}}
          >
            <LinearLayout
              width="100%"
              orientation="horiz"
              justifyContent={'space-evenly'}
            >
              {infoClaim?.icon && (
                <ImageView source={infoClaim?.icon} width={19} height={16} />
              )}
              <TextView
                color={infoClaim?.textColor}
                opacity={infoClaim?.opacity}
                alignSelf={'center'}
                fontSize={'16px'}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
              >
                {infoClaim?.text}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </RelativeLayout>
      </View>
    </TouchableWithoutFeedback>
  )
}

ThemedClaimButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isClaimAvailable: PropTypes.bool.isRequired,
  unclaimedGasAmount: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
}

export {ThemedClaimButton}
