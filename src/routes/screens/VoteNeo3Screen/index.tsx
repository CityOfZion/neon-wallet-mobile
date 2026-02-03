import React, { useMemo, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwIconButton } from '@/components/TwIconButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useAccountsByBlockchainsSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useBalance } from '@/hooks/useBalances'
import { useMount } from '@/hooks/useMount'
import {
  useCanShowVoteNeo3SupportUsModalSelector,
  useSelectedNetworkByBlockchainSelector,
} from '@/hooks/useSettingsSelector'
import {
  useVoteNeo3CalculateVoteFee,
  useVoteNeo3GetCandidatesToVote,
  useVoteNeo3GetVoteDetailsByAddress,
  useVoteNeo3Validations,
} from '@/hooks/useVoteNeo3'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import MdInfoOutline from '@/assets/images/md-info-outline.svg'
import TbSearch from '@/assets/images/tb-search.svg'

import { VoteNeo3Account } from './VoteNeo3Account'
import { VoteNeo3AvailableVotes } from './VoteNeo3AvailableVotes'
import { VoteNeo3List } from './VoteNeo3List'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState } from '@/types/store'

type TActionsData = {
  neo3Account?: IAccountState
  search: string
}

export const VoteNeo3Screen = ({ navigation, route }: TWalletsStackScreenProps<'VoteNeo3Screen'>) => {
  const { defaultNeo3Account } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'voteNeo3Screen' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { accountsByBlockchains } = useAccountsByBlockchainsSelector(['neo3'])
  const { canShowVoteNeo3SupportUsModalRef } = useCanShowVoteNeo3SupportUsModalSelector()
  const canScrollToCandidateRef = useRef(true)
  const shouldOpenVoteNeo3SupportUsModalRef = useRef(true)

  const {
    actionData: { neo3Account, search },
    setData,
    setDataWrapper,
  } = useActions<TActionsData>({ neo3Account: defaultNeo3Account, search: '' })

  // We are using VOTE_NEO3_COZ_PUB_KEY only to calculate the fee
  const calculateVoteFeeQuery = useVoteNeo3CalculateVoteFee({
    neo3Account,
    candidatePubKey: ConstantsHelper.voteNeo3CozPubKey,
  })
  const candidatesToVoteQuery = useVoteNeo3GetCandidatesToVote()
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useVoteNeo3Validations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })

  const cozCandidate = useMemo(
    () => candidatesToVoteQuery.data?.find(candidate => candidate.pubKey === ConstantsHelper.voteNeo3CozPubKey),
    [candidatesToVoteQuery.data]
  )

  const neo3Accounts = useMemo(
    () => accountsByBlockchains.filter(({ type }) => type !== 'watch'),
    [accountsByBlockchains]
  )

  const isLoading =
    calculateVoteFeeQuery.isLoading ||
    candidatesToVoteQuery.isLoading ||
    voteDetailsByAddressQuery.isLoading ||
    balanceQuery.isLoading

  const isMainnet = selectedNetworkByBlockchain.neo3.type === 'mainnet'
  const hasNeo3Accounts = neo3Accounts.length > 0
  const isSearchDisabled = candidatesToVoteQuery.isLoading || !hasNeo3Accounts || !isMainnet
  const isWatchAccount = neo3Account?.type === 'watch'
  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance ?? 0
  const hasNeoAmount = !!neo3Account && neoAmount > 0
  const canVote = !isLoading && isMainnet && !isWatchAccount && hasNeoAmount && !!hasEnoughGasToPayFee

  const voteErrorMessage = match({
    hasNeo3Accounts,
    neo3Account,
    hasNeoAmount,
    isMainnet,
    isWatchAccount,
    hasEnoughGasToPayFee,
  })
    .with({ hasNeo3Accounts: false }, () => t('voteErrorMessages.noNeo3AccountsLabel'))
    .with({ neo3Account: P.when(value => !value) }, () => t('voteErrorMessages.selectNeo3AccountLabel'))
    .with({ isMainnet: false }, () => t('voteErrorMessages.shouldUseMainnetLabel'))
    .with({ hasNeoAmount: false }, () => t('voteErrorMessages.thereIsNoNeoLabel'))
    .with({ isWatchAccount: true }, () => t('voteErrorMessages.accountCanNotBeWatchLabel'))
    .with({ hasEnoughGasToPayFee: false }, () => t('voteErrorMessages.shouldHaveEnoughGasToPayFeeLabel'))
    .otherwise(() => undefined)

  const handleGoToVoteNeo3HowItWorksModal = () => {
    navigation.navigate('VoteNeo3HowItWorksModal')
  }

  const handleSelectNeo3Account = (neo3Account: IAccountState) => {
    shouldOpenVoteNeo3SupportUsModalRef.current = false
    canScrollToCandidateRef.current = true

    setData({ neo3Account })
  }

  useMount(() => {
    if (
      !cozCandidate ||
      !shouldOpenVoteNeo3SupportUsModalRef.current ||
      !canShowVoteNeo3SupportUsModalRef.current ||
      voteDetailsByAddressQuery.isLoading ||
      ConstantsHelper.voteNeo3CozPubKey === voteDetailsByAddressQuery.data?.candidatePubKey ||
      !defaultNeo3Account
    )
      return

    shouldOpenVoteNeo3SupportUsModalRef.current = false

    navigation.navigate('VoteNeo3SupportUsModal', { neo3Account: defaultNeo3Account, cozCandidate })
  }, [voteDetailsByAddressQuery.isLoading, voteDetailsByAddressQuery.data, cozCandidate, defaultNeo3Account])

  return (
    <TwScreenLayout
      headerClassName="h-[36px] mt-2"
      contentContainerClassName="gap-y-6 w-full"
      withoutScroll
      title={
        <View className="-mt-2 flex max-w-[50%] flex-1 flex-row items-center justify-center">
          <Text className="line-clamp-1 font-sans-medium text-xl text-white">{t('title')}</Text>

          <TwIconButton
            aria-label={t('howItWorksButtonLabel')}
            size="md"
            className="mt-3"
            icon={<MdInfoOutline className="text-neon" aria-hidden />}
            onPress={handleGoToVoteNeo3HowItWorksModal}
          />
        </View>
      }
    >
      {!isLoading && !!voteErrorMessage && (
        <TwAlertErrorBanner
          className="w-full gap-x-2 px-3"
          iconClassName="h-5 w-5"
          messageClassName="text-md"
          message={voteErrorMessage}
        />
      )}

      <VoteNeo3Account
        neo3Account={neo3Account}
        isDisabled={isLoading || !hasNeo3Accounts || !isMainnet}
        onSelect={handleSelectNeo3Account}
      />

      <TwSeparator />

      <TwInput
        className="h-11 w-full text-sm placeholder:text-neon"
        aria-label={t('searchLabel')}
        placeholder={t('searchPlaceholder')}
        value={search}
        maxLength={100}
        inputContainerProps={{ className: 'bg-gray-300/15 w-full px-3 rounded' }}
        clearable
        disabled={isSearchDisabled}
        onChangeText={setDataWrapper('search')}
        leftElement={<TbSearch aria-hidden className="h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 text-neon" />}
      />

      <VoteNeo3AvailableVotes
        neoAmount={neoAmount}
        hasNeoAmount={hasNeoAmount}
        isLoading={voteDetailsByAddressQuery.isLoading}
      />

      <VoteNeo3List
        neo3Account={neo3Account}
        search={search}
        voteErrorMessage={voteErrorMessage}
        canVote={canVote}
        canScrollToCandidateRef={canScrollToCandidateRef}
      />
    </TwScreenLayout>
  )
}
