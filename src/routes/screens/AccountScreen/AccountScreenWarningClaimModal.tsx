import type { TBSToken } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { BlurView } from 'expo-blur'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, Modal, Platform, Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'

import type { TTokenBalance } from '@/types/query'

type TProps = {
  visible: boolean
  feeNumber: number
  unclaimedNumber: number
  feeTokenBalance: TTokenBalance
  claimToken: TBSToken
  onConfirm: () => void
  onReject: () => void
}

type TObservationProps = {
  title: string
  value: string
  symbol: string
}

const Observation = ({ symbol, title, value }: TObservationProps) => {
  return (
    <View className="items-center rounded-lg bg-gray-800 p-2.5">
      <Text className="font-sans-semibold text-gray-100">{title}</Text>

      <Text className="font-sans-bold text-neon">
        {value} {symbol}
      </Text>
    </View>
  )
}

export const AccountScreenWarningClaimModal = ({
  visible,
  claimToken,
  feeNumber,
  unclaimedNumber,
  feeTokenBalance,
  onReject,
  onConfirm,
}: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountScreen.warningClaimModal' })

  const handleContentPress = (event: GestureResponderEvent) => {
    event.stopPropagation()
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onReject}
      transparent
      animationType="fade"
      className="items-center justify-center"
    >
      <BlurView
        className="h-full w-full items-center justify-center"
        intensity={Platform.OS === 'ios' ? 15 : 90}
        tint="dark"
        onTouchStart={onReject}
      >
        <View className="w-full max-w-[80%] items-center rounded-2xl bg-black/85" onTouchStart={handleContentPress}>
          <View className="items-center p-5">
            <TbAlertTriangle className="size-12 text-neon" />

            <Text className="font-sans-regular text-xl text-neon">{t('highClaimFee.title')}</Text>

            <View className="my-3 flex-row gap-4">
              <Observation
                title={t('claimAmount')}
                value={BSBigNumberHelper.format(unclaimedNumber, { decimals: claimToken.decimals })}
                symbol={claimToken.symbol}
              />

              <Observation
                title={t('claimFee')}
                value={BSBigNumberHelper.format(feeNumber, { decimals: feeTokenBalance.token.decimals })}
                symbol={feeTokenBalance.token.symbol}
              />
            </View>

            <Text className="font-sans-regular text-base text-white">{t('highClaimFee.subtitle')}</Text>

            <Text className="font-sans-medium text-base text-white">{t('highClaimFee.question')}</Text>
          </View>

          <TwSeparator withoutContainer />

          <View className="flex-row justify-between">
            <TwButton variant="text" className="flex-1" label={t('buttons.no')} onPress={onReject} />
            <TwSeparator withoutContainer variant="vert" />
            <TwButton variant="text" className="flex-1" label={t('buttons.yes')} onPress={onConfirm} />
          </View>
        </View>
      </BlurView>
    </Modal>
  )
}
