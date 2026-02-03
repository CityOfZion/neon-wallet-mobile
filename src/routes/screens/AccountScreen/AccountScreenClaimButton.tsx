import { Fragment, useMemo, useState } from 'react'

import type { IBlockchainService, IBSWithClaim, TBSToken } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isClaimable } from '@cityofzion/blockchain-service'
import type { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useBalance } from '@/hooks/useBalances'
import { useUnclaimed, useUnclaimedMutation } from '@/hooks/useUnclaimedQuery'

import { AccountScreenWarningClaimModal } from './AccountScreenWarningClaimModal'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
}

export const AccountScreenClaimButton = ({ account }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountScreen' })
  const unclaimedQuery = useUnclaimed(account)
  const unclaimedMutation = useUnclaimedMutation()
  const { data: balanceData } = useBalance(account)

  const [showWarning, setShowWarning] = useState(false)

  const blockchainService = useMemo(
    () => BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain],
    [account.blockchain]
  )

  const feeTokenBalance = useMemo(
    () =>
      balanceData?.tokensBalances.find(balance =>
        blockchainService.tokenService.predicateByHash(blockchainService.feeToken, balance.token)
      ),
    [blockchainService, balanceData]
  )

  const getClaimAssetValues = () => {
    const bsService = blockchainService as IBlockchainService<TBlockchainServiceKey> &
      IBSWithClaim<TBlockchainServiceKey>
    const unclaimedData = unclaimedQuery.data
    const claimToken = bsService?.claimToken

    if (!unclaimedData || !claimToken) return { amount: '0', symbol: '' }

    return {
      amount: BSBigNumberHelper.format(unclaimedData.unclaimedNumber, { decimals: claimToken.decimals }),
      symbol: claimToken.symbol,
    }
  }

  let text: ReactNode
  let disabled: boolean
  let warning: boolean = false
  let claimToken: TBSToken | undefined

  if (!unclaimedQuery.data || !isClaimable(blockchainService) || !feeTokenBalance || unclaimedQuery.isError) {
    text = t('gasUnavailable')
    disabled = true
  } else {
    if (unclaimedQuery.data.unclaimedNumber <= 0 || feeTokenBalance.amountNumber < unclaimedQuery.data.feeNumber) {
      disabled = true
    } else if (unclaimedQuery.data.unclaimedNumber < unclaimedQuery.data.feeNumber) {
      disabled = false
      warning = true
      claimToken = blockchainService.claimToken
    } else {
      disabled = false
    }

    text = (
      <Trans t={t} i18nKey="claimAsset" values={getClaimAssetValues()}>
        end
        <Text className="text-neon">start</Text>
      </Trans>
    )
  }

  const handlePressButton = () => {
    if (warning) {
      setShowWarning(true)
      return
    }

    handleClaimGas()
  }

  const handleClaimGas = () => {
    setShowWarning(false)
    unclaimedMutation.mutate({ account, data: unclaimedQuery.data! })
  }

  return (
    <Fragment>
      <TwButton
        label={<Text className="font-sans-medium text-sm text-white">{text}</Text>}
        disabled={disabled}
        variant="outline"
        className="h-11 flex-shrink flex-grow"
        contentProps={{ className: 'px-2 gap-x-2' }}
        isLoading={unclaimedQuery.isLoading || unclaimedMutation.isPending}
        onPress={handlePressButton}
      />

      {claimToken && unclaimedQuery.data && feeTokenBalance && (
        <AccountScreenWarningClaimModal
          claimToken={claimToken}
          feeNumber={unclaimedQuery.data.feeNumber}
          feeTokenBalance={feeTokenBalance}
          unclaimedNumber={unclaimedQuery.data.unclaimedNumber}
          visible={showWarning}
          onConfirm={handleClaimGas}
          onReject={() => setShowWarning(false)}
        />
      )}
    </Fragment>
  )
}
