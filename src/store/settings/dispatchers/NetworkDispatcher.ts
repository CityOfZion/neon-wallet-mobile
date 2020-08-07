import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {Facade} from '~src/app/Facade'

export class NetworkDispatcher extends DispatcherWrapper<
  SettingsActionsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_NETWORK'

  readonly reducer: SettingsReducer = (state, action) => {
    const {network} = action

    if (network?.neoscanBaseUrl) {
      Facade.axios.defaults.baseURL = network.neoscanBaseUrl
    }

    return this.set(state, {network})
  }
}
