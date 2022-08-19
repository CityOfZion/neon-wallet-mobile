import { configureStore } from '@reduxjs/toolkit'
import { SignClientTypes } from '@walletconnect/types'
import { QueryClient } from 'react-query'
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { RootStore } from '../store/RootStore'
import { DEFAULT_APP_METADATA, DEFAULT_LOGGER, DEFAULT_PROJECT_ID, DEFAULT_RELAY_URL } from './walletConnect/constants'

export class ContextsConfig {
  readonly wcOptions: SignClientTypes.Options = {
    projectId: DEFAULT_PROJECT_ID,
    metadata: DEFAULT_APP_METADATA,
    logger: DEFAULT_LOGGER,
    relayUrl: DEFAULT_RELAY_URL,
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
