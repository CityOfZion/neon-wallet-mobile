import { formatJsonRpcError, JsonRpcResponse } from '@json-rpc-tools/utils'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import React, { useCallback, useContext, useEffect, useState } from 'react'

export type OnRequestCallback = (
  accountAddress: string,
  chainId: string,
  request: SessionRequest
) => Promise<JsonRpcResponse>
export type AutoAcceptCallback = (
  accountAddress: string | undefined,
  chainId: string | undefined,
  request: SessionRequest
) => boolean
export type SessionProposal = SignClientTypes.EventArguments['session_proposal']
export type SessionRequest = SignClientTypes.EventArguments['session_request']
export type Session = SessionTypes.Struct
export type Metadata = SignClientTypes.Metadata
export type PeerOfRequest = { publicKey: string; metadata: SignClientTypes.Metadata }
export type AddressAndChain = {
  address: string
  chain: string
}

interface IWalletConnectContext {
  signClient: SignClient | undefined
  sessionProposals: SessionProposal[]
  initialized: boolean
  sessions: SessionTypes.Struct[]
  setSessions: React.Dispatch<React.SetStateAction<SessionTypes.Struct[]>>
  requests: SessionRequest[]
  init: () => Promise<void>
  onURI: (data: any) => Promise<void>
  getPeerOfRequest: (requestEvent: SessionRequest) => Promise<PeerOfRequest>
  approveSession: (
    proposal: SessionProposal,
    accountsAndChains: AddressAndChain[],
    namespacesWithoutAccounts: SessionTypes.Namespaces
  ) => Promise<void>
  rejectSession: (proposal: SessionProposal) => Promise<void>
  disconnect: (topic: string) => Promise<void>
  approveRequest: (requestEvent: SessionRequest) => Promise<JsonRpcResponse | null>
  rejectRequest: (requestEvent: SessionRequest, error?: string) => Promise<void>
  onRequestListener: (listener: OnRequestCallback) => void
  autoAcceptIntercept: (listener: AutoAcceptCallback) => void
}

export const WalletConnectContext = React.createContext({} as IWalletConnectContext)

export const WalletConnectContextProvider: React.FC<{
  options: SignClientTypes.Options
  children: any
}> = ({ options, children }) => {
  const [signClient, setSignClient] = useState<SignClient | undefined>(undefined)
  const [sessionProposals, setSessionProposals] = useState<SessionProposal[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [sessions, setSessions] = useState<SessionTypes.Struct[]>([])
  const [requests, setRequests] = useState<SessionRequest[]>([])
  const [onRequestCallback, setOnRequestCallback] = useState<OnRequestCallback | undefined>(undefined)
  const [autoAcceptCallback, setAutoAcceptCallback] = useState<AutoAcceptCallback | undefined>(undefined)

  const init = useCallback(async () => {
    try {
      const client = await SignClient.init(options)
      setSignClient(client)
    } catch (error) {
      console.log(error)
    }
  }, [options])

  const loadSessions = useCallback(async () => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    setSessions(signClient.session.values)
    setInitialized(true)
  }, [signClient])

  // // ---- MAKE REQUESTS AND SAVE/CHECK IF APPROVED ------------------------------//

  const onRequestListener = useCallback((listener: OnRequestCallback) => {
    setOnRequestCallback(() => listener)
  }, [])

  const autoAcceptIntercept = useCallback((listener: AutoAcceptCallback) => {
    setAutoAcceptCallback(() => listener)
  }, [])

  const findSessionByTopic = useCallback(
    (topic: string) => {
      return sessions.find(session => session.topic === topic)
    },
    [JSON.stringify(sessions)]
  )

  const makeRequest = useCallback(
    async (requestEvent: SessionRequest) => {
      const foundSession = findSessionByTopic(requestEvent.topic)
      const ns = Object.values(foundSession?.namespaces ?? [])[0] as any
      const acc = ns?.accounts[0]
      if (!acc) {
        throw new Error('There is no Account')
      }
      const [namespace, reference, address] = acc?.split(':')
      const chainId = `${namespace}:${reference}`
      if (!onRequestCallback) {
        throw new Error('There is no onRequestCallback')
      }
      return await onRequestCallback(address, chainId, requestEvent)
    },
    [findSessionByTopic]
  )

  const respondRequest = useCallback(
    async (topic: string, response: JsonRpcResponse) => {
      if (!signClient) {
        throw new Error('Client is not initialized')
      }
      await signClient.respond({ topic, response })
    },
    [signClient]
  )

  const subscribeToEvents = useCallback(() => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }

    signClient.events.removeAllListeners()

    signClient.on('session_proposal', (proposal: SessionProposal) => {
      setSessionProposals(old => [...old, proposal])
    })

    signClient.on('session_request', async (requestEvent: SessionRequest) => {
      try {
        if (autoAcceptCallback) {
          let address: string | undefined = undefined
          let chainId: string | undefined = undefined
          const foundSession = findSessionByTopic(requestEvent.topic)
          const ns = Object.values(foundSession?.namespaces ?? [])[0] as SessionTypes.Namespace | undefined
          const acc = ns?.accounts[0]
          if (acc) {
            const [namespace, reference, addr] = acc.split(':')
            address = addr
            chainId = `${namespace}:${reference}`
          }
          const autoAccepted = autoAcceptCallback(address, chainId, requestEvent)
          if (autoAccepted) {
            const response = await makeRequest(requestEvent)
            await respondRequest(requestEvent.topic, response)
            return
          }
        }

        setRequests(old => [...old.filter(i => i.id !== requestEvent.id), requestEvent])
      } catch (e) {
        const response = formatJsonRpcError(requestEvent.id, (e as any).message)
        await respondRequest(requestEvent.topic, response)
      }
    })

    signClient.on('session_delete', () => {
      if (!signClient) {
        throw new Error('Client is not initialized')
      }
      setSessions(signClient.session.values)
    })
  }, [makeRequest, respondRequest, signClient, findSessionByTopic])

  const onURI = async (data: any) => {
    try {
      const uri = typeof data === 'string' ? data : ''
      if (!uri) return
      if (!signClient) {
        throw new Error('Client is not initialized')
      }

      await signClient.pair({ uri })
    } catch (error) {
      throw error
    }
  } // this should not be a callback because it would require the developer to put it as dependency

  const getPeerOfRequest = async (requestEvent: SessionRequest) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    const { peer } = await signClient.session.get(requestEvent.topic)
    return peer
  } // this should not be a callback because it would require the developer to put it as dependency

  const approveSession = async (
    proposal: SessionProposal,
    accountsAndChains: AddressAndChain[],
    namespacesWithoutAccounts: SessionTypes.Namespaces
  ) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    if (typeof accountsAndChains === 'undefined') {
      throw new Error('Accounts is undefined')
    }
    const accounts = accountsAndChains.map(acc => `${acc.chain}:${acc.address}`)

    const namespaces = Object.keys(namespacesWithoutAccounts).reduce((result, key) => {
      result[key] = { ...namespacesWithoutAccounts[key], accounts }
      return result
    }, {} as SessionTypes.Namespaces)

    const { acknowledged } = await signClient.approve({
      id: proposal.id,
      namespaces,
    })

    const session = await acknowledged()

    setSessionProposals(old => old.filter(i => i !== proposal))
    setSessions([session])
  } // this should not be a callback because it would require the developer to put it as dependency

  const rejectSession = async (proposal: SessionProposal) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    await signClient.reject({
      id: proposal.id,
      reason: {
        code: 1,
        message: 'rejected by the user',
      },
    })
    setSessionProposals(old => old.filter(i => i !== proposal))
  } // this should not be a callback because it would require the developer to put it as dependency

  const disconnect = async (topic: string) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    await signClient.disconnect({
      topic,
      reason: { code: 5900, message: 'USER_DISCONNECTED' },
    })

    setSessions(signClient.session.values)
  } // this should not be a callback because it would require the developer to put it as dependency

  const removeFromPending = useCallback(async (requestEvent: SessionRequest) => {
    setRequests(requests.filter(x => x.id !== requestEvent.id))
  }, [])

  const approveRequest = async (requestEvent: SessionRequest) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    try {
      const response = await makeRequest(requestEvent)
      await signClient.respond({
        topic: requestEvent.topic,
        response,
      })
      await removeFromPending(requestEvent)
      return response
    } catch (error: any) {
      await signClient.respond({
        topic: requestEvent.topic,
        response: formatJsonRpcError(requestEvent.id, error.message ?? 'Failed or Rejected Request'),
      })
      throw error
    }
  } // this should not be a callback because it would require the developer to put it as dependency

  const rejectRequest = async (requestEvent: SessionRequest, error?: string) => {
    if (!signClient) {
      throw new Error('Client is not initialized')
    }
    await signClient.respond({
      topic: requestEvent.topic,
      response: formatJsonRpcError(requestEvent.id, error ?? 'Failed or Rejected Request'),
    })
    await removeFromPending(requestEvent)
  } // this should not be a callback because it would require the developer to put it as dependency

  useEffect(() => {
    if (signClient) {
      subscribeToEvents()
      loadSessions()
    }
  }, [signClient, subscribeToEvents, loadSessions])

  const contextValue: IWalletConnectContext = {
    signClient,
    sessionProposals,
    initialized,
    sessions,
    setSessions,
    requests,
    init,
    onURI,
    getPeerOfRequest,
    approveSession,
    rejectSession,
    disconnect,
    approveRequest,
    rejectRequest,
    onRequestListener,
    autoAcceptIntercept,
  }

  return <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>
}

export const useWalletConnect = (): IWalletConnectContext => useContext(WalletConnectContext)
