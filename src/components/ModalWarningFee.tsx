import {BlurView} from 'expo-blur'
import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback} from 'react'
import {Modal, View, TouchableOpacity, ImageLoadEventData} from 'react-native'
import {useSelector} from 'react-redux'

import {FilterHelper} from '~src/helpers/FilterHelper'
import {ImageView, TextView} from '~src/styles/styled-components'

interface Props {
  showWarning: boolean
  setShowWarning: (show: boolean) => void
  amountFee: number
  unclaimedGasAmount: number
  totTokenFeeAccount: number
  onPress: () => Promise<void>
}

type TStatusWarning = 'high' | 'insuficient'

const ModalWarningFee = ({
  onPress,
  amountFee,
  showWarning,
  setShowWarning,
  unclaimedGasAmount,
  totTokenFeeAccount,
}: Props) => {
  const {language} = useSelector((state: RootState) => state.settings)
  const warningInfo: Record<
    TStatusWarning,
    {
      icon: ImageLoadEventData
      title: {label: string; color: string}
      subtitle: string
      observations: {title: string; content: string}[]
      buttons: {label: string; onPress: () => void}[]
      question?: string
    }
  > = {
    high: {
      title: {
        label: i18n.t('modals.warningFee.highClaimFee.title'),
        color: '#4cffb3',
      },
      subtitle: i18n.t('modals.warningFee.highClaimFee.subtitle'),
      question: i18n.t('modals.warningFee.highClaimFee.question'),
      observations: [
        {
          title: i18n.t('modals.warningFee.claimAmount'),
          content: FilterHelper.decimal(unclaimedGasAmount, language, 8),
        },
        {
          title: i18n.t('modals.warningFee.claimFee'),
          content: String(amountFee),
        },
      ],
      buttons: [
        {
          label: i18n.t('modals.warningFee.buttons.no'),
          onPress: () => {
            setShowWarning(false)
          },
        },
        {
          label: i18n.t('modals.warningFee.buttons.yes'),
          onPress: () => {
            onPress()
            setShowWarning(false)
          },
        },
      ],
      icon: require('~src/assets/images/icon-warning-green.png'),
    },
    insuficient: {
      title: {
        label: i18n.t('modals.warningFee.insufficientFunds.title'),
        color: '#d355e7',
      },
      subtitle: i18n.t('modals.warningFee.insufficientFunds.subtitle'),
      observations: [
        {
          title: i18n.t('modals.warningFee.claimAmount'),
          content: String(amountFee),
        },
      ],
      buttons: [
        {
          label: i18n.t('modals.warningFee.buttons.ok'),
          onPress: () => {
            setShowWarning(false)
          },
        },
      ],
      icon: require('~src/assets/images/icon-warning-purple.png'),
    },
  }

  const [statusWarning, setStatusWarning] = useState<TStatusWarning>(
    'insuficient'
  )

  const {buttons, icon, observations, subtitle, title, question} = warningInfo[
    statusWarning
  ]

  const handleStatusWarning = useCallback(() => {
    if (amountFee > totTokenFeeAccount) {
      setStatusWarning('insuficient')
    } else if (unclaimedGasAmount < amountFee) {
      setStatusWarning('high')
    }
  }, [amountFee, unclaimedGasAmount, showWarning])

  useEffect(() => {
    handleStatusWarning()
  }, [amountFee, unclaimedGasAmount, showWarning])

  return showWarning ? (
    <Modal transparent={true} animationType="fade" visible={showWarning}>
      <BlurView intensity={40} tint="dark" style={{height: '100%'}}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#191f23',
            width: '90%',
            opacity: 0.9,
            alignSelf: 'center',
            marginTop: '60%',
            paddingVertical: 15,
            borderRadius: 14,
            justifyContent: 'space-between',
            height: '35%',
          }}
        >
          <ImageView source={icon} width={45} height={35} />
          <TextView color={title.color} fontSize="20px">
            {title.label}
          </TextView>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly',
            }}
          >
            {observations.map((obs, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#090d10',
                  borderRadius: 7,
                  alignItems: 'center',
                  padding: 10,
                }}
              >
                <TextView fontSize="14px" color="#899fa8  ">
                  {obs.title}
                </TextView>
                <TextView color="#4cffb3" fontFamily="bold">
                  {obs.content} GAS
                </TextView>
              </View>
            ))}
          </View>

          <TextView fontFamily="light" fontSize="16px" color="#fff">
            {subtitle}
          </TextView>

          {question && (
            <TextView fontFamily="medium" fontSize="16px" color="#fff">
              {question}
            </TextView>
          )}
          <View
            style={{height: 1, width: '100%', backgroundColor: '#ffffff44'}}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
            }}
          >
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => btn.onPress()}
                style={{alignItems: 'center', width: '50%'}}
              >
                <TextView color="#4cffb3" fontSize="20px">
                  {btn.label}
                </TextView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  ) : (
    <></>
  )
}

export default ModalWarningFee
