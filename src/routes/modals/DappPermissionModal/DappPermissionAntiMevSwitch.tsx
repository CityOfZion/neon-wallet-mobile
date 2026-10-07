import { useState } from 'react'

import { BSNeoXConstants } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'

import { Switch } from '@/components/Switch'

import { NetworkHelper } from '@/helpers/NetworkHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
}

export const DappPermissionAntiMevSwitch = ({ blockchain }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission.antiMevSwitch' })
  const { selectedNetwork } = useSelectedNetworkSelector('neox')
  const dispatch = useAppDispatch()

  const [isChecked, setIsChecked] = useState(
    NetworkHelper.isNeoxAntiMev({ blockchain, networkId: selectedNetwork.id, url: selectedNetwork.url })
  )

  if (blockchain !== 'neox') return null

  const handleCheckedChange = (checked: boolean) => {
    const rpcUrls: string[] =
      BSNeoXConstants.RPC_LIST_BY_NETWORK_ID[
        selectedNetwork.id as keyof typeof BSNeoXConstants.RPC_LIST_BY_NETWORK_ID
      ] || []

    let url: string | undefined

    if (checked) {
      url = rpcUrls.find(rpcUrl =>
        NetworkHelper.isNeoxAntiMev({ blockchain, networkId: selectedNetwork.id, url: rpcUrl })
      )
    } else {
      url = rpcUrls.find(
        rpcUrl => !NetworkHelper.isNeoxAntiMev({ blockchain, networkId: selectedNetwork.id, url: rpcUrl })
      )
    }

    if (!url) {
      ToastHelper.error({
        message: checked ? t('antiMevEnableUrlNotFoundError') : t('antiMevDisableUrlNotFoundError'),
      })
      return
    }

    setIsChecked(checked)
    dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain: 'neox', url, isAutomatic: false }))
  }

  return (
    <Switch.Root>
      <Switch.Label>{t('antiMevSwitchLabel')}</Switch.Label>
      <Switch.Control checked={isChecked} onCheckedChange={handleCheckedChange} />
    </Switch.Root>
  )
}
