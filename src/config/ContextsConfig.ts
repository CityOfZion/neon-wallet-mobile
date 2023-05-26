import { configureStore } from '@reduxjs/toolkit'
import { SignClientTypes } from '@walletconnect/types'
import { QueryClient } from 'react-query'
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { RootStore } from '../store/RootStore'
import { walletConnectConfig } from './WalletConnectConfig'

export class ContextsConfig {
  readonly wcOptions: SignClientTypes.Options = {
    projectId: walletConnectConfig.defaultProjectId,
    metadata: walletConnectConfig.defaultAppMetadata,
    logger: walletConnectConfig.defaultLogger,
    relayUrl: walletConnectConfig.defaultRelayURL,
  }

  readonly store = configureStore({
    reducer: RootStore.reducers,
    middleware: getDefaultMiddleware => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    ],
  })

  readonly persistor = persistStore(this.store)

  readonly queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  })
}

export const contextsConfig = new ContextsConfig()
