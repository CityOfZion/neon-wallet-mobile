import { Fragment, useMemo, useState } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isClaimable } from '@cityofzion/blockchain-service'
import type { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useBalance } from '@/hooks/useBalances'
import { useUnclaimed, useUnclaimedMutation } from '@/hooks/useUnclaimedQuery'

import { AccountScreenWarningClaimModal } from './AccountScreenWarningClaimModal'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
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

  let text: ReactNode
  let disabled: boolean
  let warning: boolean = false
  let claimToken: TBSToken | undefined

  if (!unclaimedQuery.data || !isClaimable(blockchainService) || !feeTokenBalance || unclaimedQuery.isError) {
    text = t('gasUnavailable')
    disabled = true
  } else {
    claimToken = blockchainService.claimService.claimToken

    if (
      account.type === 'watch' ||
      unclaimedQuery.data.unclaimedNumber <= 0 ||
      feeTokenBalance.amountNumber < unclaimedQuery.data.feeNumber
    ) {
      disabled = true
    } else if (unclaimedQuery.data.unclaimedNumber < unclaimedQuery.data.feeNumber) {
      disabled = false
      warning = true
    } else {
      disabled = false
    }

    text = (
      <Trans
        t={t}
        i18nKey="claimAsset"
        values={{
          amount: BSBigNumberHelper.format(unclaimedQuery.data.unclaimedNumber, { decimals: claimToken.decimals }),
          symbol: claimToken.symbol,
        }}
      >
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
    unclaimedMutation.mutate(account)
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
