import { createSlice, CaseReducer, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { Storage } from '~/src/app/Storage'
import { blockchainConfig, TBlockchainNetwork } from '~/src/config/BlockchainConfig'
import { localeConfig } from '~/src/config/LocaleConfig'
import { Currency } from '~/src/enums/Currency'
import { Lang } from '~/src/enums/Lang'
import { Security } from '~/src/enums/Security'
import { Theme } from '~/src/enums/Theme'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import { SettingsState } from '~/src/types/store'

type TSetNetworkPayload = Omit<TBlockchainNetwork, 'id'> & {
  blockchain: TBlockchainServiceKey
}

type TEditNetworkPayload = {
  id: string
  blockchain: TBlockchainServiceKey
  data: Partial<Omit<TBlockchainNetwork, 'id'>>
}

type TSelectNetworkPayload = {
  id: string
  blockchain: TBlockchainServiceKey
}

type TDeleteNetworkPayload = {
  id: string
  blockchain: TBlockchainServiceKey
}

export const settingsReducerName = 'settingsReducer'

const initialState: SettingsState = {
  language: localeConfig.defaultLanguage,
  currency: localeConfig.defaultCurrency,
  isFirstTime: true,
  security: localeConfig.defaultSecurity,
  theme: Theme.DARK,
  blockchainNetworks: blockchainConfig.defaultNetworks,
  selectedBlockchainNetworks: blockchainConfig.defaultSelectedNetworks,
}

const migrateSettingsStorage = createAsyncThunk('settings/migrateSettingsStorage', async () => {
  return Storage.settings.load()
})

const setTheme: CaseReducer<SettingsState, PayloadAction<Theme>> = (state, action) => {
  const theme = action.payload
  state.theme = theme
}

const setLanguage: CaseReducer<SettingsState, PayloadAction<Lang>> = (state, action) => {
  const language = action.payload
  state.language = language
}

const setSecurity: CaseReducer<SettingsState, PayloadAction<Security>> = (state, action) => {
  const security = action.payload
  state.security = security
}

const setCurrency: CaseReducer<SettingsState, PayloadAction<Currency>> = (state, action) => {
  const currency = action.payload
  state.currency = currency
}

const setIsFirstTime: CaseReducer<SettingsState, PayloadAction<boolean>> = (state, action) => {
  const isFirstTime = action.payload
  state.isFirstTime = isFirstTime
}

const addBlockchainNetwork: CaseReducer<SettingsState, PayloadAction<TSetNetworkPayload>> = (state, action) => {
  const { blockchain } = action.payload

  const cloneNetworks = cloneDeep(state.blockchainNetworks)
  cloneNetworks[blockchain].push({
    id: UtilsHelper.uuid(),
    ...action.payload,
  })

  state.blockchainNetworks = cloneNetworks
}

const editBlockchainNetwork: CaseReducer<SettingsState, PayloadAction<TEditNetworkPayload>> = (state, action) => {
  const { blockchain, id, data } = action.payload
  const cloneNetworks = cloneDeep(state.blockchainNetworks)
  const networkIndex = cloneNetworks[blockchain].findIndex(network => network.id === id)

  if (networkIndex === -1) throw new Error("Can't find network with passed id")

  cloneNetworks[blockchain][networkIndex] = {
    ...cloneNetworks[blockchain][networkIndex],
    ...data,
  }

  state.blockchainNetworks = cloneNetworks
}

const setSelectNetwork = (state: SettingsState, action: PayloadAction<TSelectNetworkPayload>) => {
  const { blockchain, id } = action.payload

  const network = state.blockchainNetworks[blockchain].find(network => network.id === id)

  if (!network) throw new Error("Can't find network with passed id")

  const cloneSelectedNetworks = cloneDeep(state.selectedBlockchainNetworks)
  cloneSelectedNetworks[blockchain] = network

  state.selectedBlockchainNetworks = cloneSelectedNetworks
}

const deleteBlockchainNetwork: CaseReducer<SettingsState, PayloadAction<TDeleteNetworkPayload>> = (state, action) => {
  const { id, blockchain } = action.payload

  const cloneNetworks = cloneDeep(state.blockchainNetworks)
  const networks = cloneNetworks[blockchain]

  const networkIndex = networks.findIndex(network => network.id === id)

  if (networkIndex === -1) throw new Error("Can't find network with passed id")

  networks.splice(networkIndex, 1)

  state.blockchainNetworks = cloneNetworks

  const cloneSelectedNetworks = cloneDeep(state.selectedBlockchainNetworks)

  if (cloneSelectedNetworks[blockchain].id === id) {
    cloneSelectedNetworks[blockchain] = blockchainConfig.defaultSelectedNetworks[blockchain]
    state.selectedBlockchainNetworks = cloneSelectedNetworks
  }
}

const SettingsReducer = createSlice({
  name: settingsReducerName,
  initialState,
  reducers: {
    setTheme,
    setLanguage,
    setSecurity,
    setCurrency,
    setIsFirstTime,
    addBlockchainNetwork,
    editBlockchainNetwork,
    setSelectNetwork,
    deleteBlockchainNetwork,
  },
  extraReducers(builder) {
    builder.addCase(migrateSettingsStorage.fulfilled, (state, action) => {
      const settings = action.payload
      if (Object.keys(state).length < 1 && settings) {
        state = {
          ...state,
          currency: settings.currency,
          isFirstTime: settings.isFirstTime,
          language: settings.language,
          security: settings.security,
          theme: settings.theme,
        }
      }
      Storage.settings.erase()

      const blockchainNetworks = {
        ...state.blockchainNetworks,
      }

      const selectedBlockchainNetworks = {
        ...state.selectedBlockchainNetworks,
      }

      Object.entries(blockchainConfig.defaultNetworks).forEach(([blockchain, networks]) => {
        if (blockchain in blockchainNetworks) return
        blockchainNetworks[blockchain as TBlockchainServiceKey] = networks
      })

      Object.entries(blockchainConfig.defaultSelectedNetworks).forEach(([blockchain, network]) => {
        if (blockchain in selectedBlockchainNetworks) return
        selectedBlockchainNetworks[blockchain as TBlockchainServiceKey] = network
      })

      state.blockchainNetworks = blockchainNetworks
      state.selectedBlockchainNetworks = selectedBlockchainNetworks
    })
  },
})

export const settingsReducerActions = {
  ...SettingsReducer.actions,
  migrateSettingsStorage,
}

export default SettingsReducer.reducer
