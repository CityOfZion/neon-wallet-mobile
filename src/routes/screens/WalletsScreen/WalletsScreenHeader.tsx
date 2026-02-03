import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useAppDispatch } from '@/hooks/useRedux'

import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'

import { WalletsScreenNotificationButton } from './WalletsScreenNotificationButton'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { IWalletState } from '@/types/store'

type Props = {
  selectedWallet?: IWalletState
}

export const WalletsScreenHeader = ({ selectedWallet }: Props) => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { t } = useTranslation('screens', { keyPrefix: 'walletsScreen' })

  const handlePressMore = () => {
    navigation.navigate('WalletContextModal', { wallet: selectedWallet })
  }

  const handlePressWarning = () => {
    if (!selectedWallet) return

    dispatch(walletReducerActions.saveWallet({ ...selectedWallet, backupStatus: 'unsuccessful_with_knowledge' }))

    navigation.navigate('BackupAlertModal', {
      wallet: selectedWallet,
    })
  }

  return (
    <View className="flex-row items-center justify-between pb-6 pt-2.5">
      <WalletsScreenNotificationButton />

      {selectedWallet?.type === 'standard' && (
        <View
          className={StyleHelper.mergeStyles('flex-1 flex-row items-center justify-center', {
            'justify-end': selectedWallet?.backupStatus === 'unsuccessful_with_knowledge',
          })}
        >
          {selectedWallet?.backupStatus === 'unsuccessful' ? (
            <TwButton
              className="h-9"
              variant="text-slim"
              label={t('walletBackupButtonLabel')}
              leftElement={<TbAlertTriangleFilled aria-hidden className="h-5 w-5" />}
              onPress={handlePressWarning}
              labelProps={{
                className: 'text-xs font-sans-bold uppercase',
              }}
            />
          ) : (
            selectedWallet?.backupStatus === 'unsuccessful_with_knowledge' && (
              <TbAlertTriangleFilled aria-hidden className="h-5 w-5 text-neon" />
            )
          )}
        </View>
      )}

      <TwIconButton icon={<MdMoreHoriz aria-hidden className="text-white" />} onPress={handlePressMore} />
    </View>
  )
}
