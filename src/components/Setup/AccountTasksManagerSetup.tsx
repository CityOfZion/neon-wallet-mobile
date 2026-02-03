import { useRef } from 'react'

import { hasNft } from '@cityofzion/blockchain-service'
import intersection from 'lodash/intersection'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SkinHelper } from '@/helpers/SkinHelper'

import { useEditAccount } from '@/hooks/useAccountActions'
import { useOwnAccountsSelector } from '@/hooks/useAccountSelector'
import { useLazyBalance } from '@/hooks/useBalances'
import { useLazyOwnershipOfItemNeo3NftSkin } from '@/hooks/useItemNeo3NftSkins'
import { useMount } from '@/hooks/useMount'
import { useUnreadNotificationsSelector } from '@/hooks/useNotificationSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useLazyVoteNeo3GetVoteDetailsByAddress } from '@/hooks/useVoteNeo3'

import { notificationReducerActions } from '@/store/reducers/notification'
import { utilityReducerActions } from '@/store/reducers/utility'
import type { TBalance } from '@/types/query'
import type { IAccountState, TNotification } from '@/types/store'

const useFraudulentTokensNotificationProcess = () => {
  const dispatch = useAppDispatch()

  const fraudulentNotificationsSetRef = useRef<Set<string>>(new Set())

  const generateNotificationKey = (blockchain: string, address: string, tokenHash: string) => {
    return `${blockchain}:${address}:${tokenHash}`
  }

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload
      if (payload?.to !== 'hide-fraudulent-token' || !payload.tokenHash) return

      const key = generateNotificationKey(payload.blockchain, payload.address, payload.tokenHash)

      fraudulentNotificationsSetRef.current.add(key)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useFraudulentTokensNotificationProcess', operation: 'processNotification' })
    }
  }

  const process = (account: IAccountState, balance: TBalance | undefined) => {
    try {
      if (!balance) return

      const fraudulentHashes = ConstantsHelper.fraudulentTokenHashesByBlockchain.get(account.blockchain)
      if (!fraudulentHashes) return

      const fraudulentTokensOwned = new Set(intersection([...fraudulentHashes], [...balance.tokensBalancesMap.keys()]))

      for (const fraudulentHash of fraudulentTokensOwned) {
        const tokenBalance = balance.tokensBalancesMap.get(fraudulentHash)!

        const notificationKey = generateNotificationKey(account.blockchain, account.address, tokenBalance.token.hash)

        if (fraudulentNotificationsSetRef.current.has(notificationKey)) continue

        dispatch(
          notificationReducerActions.saveNotification({
            title: 'components:setup.accountTasksManager.useFraudulentTokensNotificationProcess.notificationTitle',
            previewBody:
              'components:setup.accountTasksManager.useFraudulentTokensNotificationProcess.notificationDescription',
            previewBodyValue: tokenBalance.token.name,
            titleValue: tokenBalance.token.name,
            priority: 'high',
            action: {
              type: 'navigate',
              payload: {
                to: 'hide-fraudulent-token',
                address: balance.address,
                blockchain: balance.blockchain,
                tokenHash: tokenBalance.token.hash,
              },
            },
            related: {
              address: balance.address,
              blockchain: balance.blockchain,
            },
          })
        )
      }
    } catch (error) {
      LoggerHelper.error(error, { where: 'useFraudulentTokensNotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    fraudulentNotificationsSetRef.current.clear()
  }

  return { process, processNotification, finish }
}

const useVotingNeo3NotificationProcess = () => {
  const dispatch = useAppDispatch()
  const { getVoteDetails } = useLazyVoteNeo3GetVoteDetailsByAddress()

  const votingNotificationsSetRef = useRef<Set<string>>(new Set())

  const generateNotificationKey = (blockchain: string, address: string) => {
    return `${blockchain}:${address}`
  }

  const processNotification = (notification: TNotification) => {
    try {
      const payload = notification.action?.payload

      if (payload?.to !== 'vote-neo3' || payload.blockchain !== 'neo3' || !payload.address) return

      votingNotificationsSetRef.current.add(generateNotificationKey(payload.blockchain, payload.address))
    } catch (error) {
      LoggerHelper.error(error, { where: 'useVotingNeo3NotificationProcess', operation: 'processNotification' })
    }
  }

  const process = async (account: IAccountState) => {
    try {
      if (account.blockchain !== 'neo3') return

      const notificationKey = generateNotificationKey(account.blockchain, account.address)

      if (votingNotificationsSetRef.current.has(notificationKey)) return

      const voteDetails = await getVoteDetails(account.address)

      if (!voteDetails || voteDetails.candidatePubKey || voteDetails.neoBalance === 0) return

      dispatch(
        notificationReducerActions.saveNotification({
          title: 'components:setup.accountTasksManager.useVotingNeo3NotificationProcess.notificationTitle',
          previewBody: 'components:setup.accountTasksManager.useVotingNeo3NotificationProcess.notificationDescription',
          action: {
            type: 'navigate',
            payload: {
              to: 'vote-neo3',
              address: voteDetails.address,
              blockchain: 'neo3',
            },
          },
          related: {
            blockchain: 'neo3',
            address: voteDetails.address,
          },
        })
      )
    } catch (error) {
      LoggerHelper.error(error, { where: 'useVotingNeo3NotificationProcess', operation: 'process' })
    }
  }

  const finish = () => {
    votingNotificationsSetRef.current.clear()
  }

  return { process, processNotification, finish }
}

const useUnlockLocalSkinsProcess = () => {
  const dispatch = useAppDispatch()
  const { editAccount } = useEditAccount()

  const unlockLocalSkinsSetRef = useRef<Set<string>>(new Set())
  const accountWithLocalSkinsRef = useRef<IAccountState[]>([])

  const process = async (account: IAccountState) => {
    try {
      if (account.skin.type === 'local') {
        accountWithLocalSkinsRef.current.push(account)
      }

      if (unlockLocalSkinsSetRef.current.size === SkinHelper.localSkins.size) return

      for (const [key, skin] of SkinHelper.localSkins) {
        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
        if (unlockLocalSkinsSetRef.current.has(key) || account.blockchain !== skin.blockchain || !hasNft(service))
          continue

        const hasToken = await service.nftDataService.hasToken({
          address: account.address,
          collectionHash: skin.collectionHash,
        })

        if (!hasToken) continue

        unlockLocalSkinsSetRef.current.add(key)
      }
    } catch (error) {
      LoggerHelper.error(error, { where: 'useUnlockLocalSkinsProcess', operation: 'process' })
    }
  }

  const finish = async () => {
    try {
      dispatch(utilityReducerActions.setUnlockedSkinIds([...unlockLocalSkinsSetRef.current]))

      for (const account of accountWithLocalSkinsRef.current) {
        if (unlockLocalSkinsSetRef.current.has(account.skin.id)) continue
        await editAccount({ account, data: { skin: { type: 'color', id: SkinHelper.getSkinColor() } } })
      }

      accountWithLocalSkinsRef.current = []
      unlockLocalSkinsSetRef.current.clear()
    } catch (error) {
      LoggerHelper.error(error, { where: 'useUnlockLocalSkinsProcess', operation: 'finish' })
    }
  }

  return { process, finish }
}

const useCheckItemNeo3NftSkinOwnership = () => {
  const { getOwnership } = useLazyOwnershipOfItemNeo3NftSkin()
  const { editAccount } = useEditAccount()

  const process = async (account: IAccountState) => {
    try {
      if (account.skin.type !== 'nft') return

      const address = await getOwnership(account, account.skin)

      if (address === account.address) return

      await editAccount({ account, data: { skin: { type: 'color', id: SkinHelper.getSkinColor() } } })
    } catch (error) {
      LoggerHelper.error(error, { where: 'useCheckItemNeo3NftSkinOwnership', operation: 'process' })
    }
  }

  return { process }
}

const AccountTasksManagerSetup = () => {
  const { ownAccounts } = useOwnAccountsSelector()
  const { unreadNotificationsRef } = useUnreadNotificationsSelector()

  const { getBalance } = useLazyBalance()

  const fraudulentTokenProcess = useFraudulentTokensNotificationProcess()
  const votingNeo3Process = useVotingNeo3NotificationProcess()
  const unlockLocalSkinsProcess = useUnlockLocalSkinsProcess()
  const checkNftSkinOwnershipProcess = useCheckItemNeo3NftSkinOwnership()

  const accountsAlreadyProcessedRef = useRef<Set<string>>(new Set())

  useMount(() => {
    requestIdleCallback(
      async () => {
        for (const notification of unreadNotificationsRef.current) {
          fraudulentTokenProcess.processNotification(notification)
          votingNeo3Process.processNotification(notification)
        }

        for (const account of ownAccounts) {
          if (accountsAlreadyProcessedRef.current.has(account.id)) continue

          accountsAlreadyProcessedRef.current.add(account.id)

          const balance = await getBalance(account, { showType: 'active' })

          fraudulentTokenProcess.process(account, balance)
          await votingNeo3Process.process(account)
          await unlockLocalSkinsProcess.process(account)
          await checkNftSkinOwnershipProcess.process(account)
        }

        fraudulentTokenProcess.finish()
        votingNeo3Process.finish()
        await unlockLocalSkinsProcess.finish()
      },
      { timeout: 15000 }
    )
  }, [ownAccounts.length])

  return null
}

export default AccountTasksManagerSetup
