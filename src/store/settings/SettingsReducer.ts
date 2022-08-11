import { createSlice, CaseReducer, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { Storage } from '~/src/app/Storage'
import { localeConfig } from '~/src/config/LocaleConfig'
import { Currency } from '~/src/enums/Currency'
import { Lang } from '~/src/enums/Lang'
import { Security } from '~/src/enums/Security'
import { Theme } from '~/src/enums/Theme'
import { SettingsState } from '~/src/types/reducers/settings'
export const settingsReducerName = 'settingsReducer'

const initialState: SettingsState = {
  language: localeConfig.defaultLanguage,
  currency: localeConfig.defaultCurrency,
  isFirstTime: true,
  security: localeConfig.defaultSecurity,
  theme: Theme.DARK,
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

const SettingsReducer = createSlice({
  name: settingsReducerName,
  initialState,
  reducers: {
    setTheme,
    setLanguage,
    setSecurity,
    setCurrency,
    setIsFirstTime,
  },
  extraReducers(builder) {
    builder.addCase(migrateSettingsStorage.fulfilled, (state, action) => {
      const settings = action.payload
      if (Object.keys(state).length < 1 && settings) {
        state = {
          currency: settings.currency,
          isFirstTime: settings.isFirstTime,
          language: settings.language,
          security: settings.security,
          theme: settings.theme,
        }
      }
      Storage.settings.erase()
    })
  },
})

export const settingsReducerActions = {
  ...SettingsReducer.actions,
  migrateSettingsStorage,
}

export default SettingsReducer.reducer
