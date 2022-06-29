import { ReducerWrapper } from '@simpli/redux-wrapper'
import moment from 'moment'

import { SetApprovalDateDispatcher } from './dispatchers/SetApprovalDateDispatcher'

import { Model } from '~/src/app/Model'
import { AsyncAction } from '~/src/types/reducers/root'
import { WCAction, WCActionsType, WCState } from '~/src/types/reducers/wcApprovalDate'
import { Storage } from '~src/app/Storage'
import { WCApprovalDate } from '~src/models/redux/WCApprovalDate'

export class WalletConnectReducer extends ReducerWrapper<WCActionsType, WCState, WCAction> {
  protected readonly initialState = Model.parse<WCState>(WCApprovalDate)

  protected readonly dispatchers = [SetApprovalDateDispatcher]

  readonly actions = {
    updateApprovalDate: (sessionTopic: string): AsyncAction => {
      return async (dispatch, getState) => {
        const approvalDates = (await Storage.wcApprovalDates.load()) ?? []
        approvalDates.push({ sessionTopic, approvalDate: moment().unix() })
        await Storage.wcApprovalDates.save(approvalDates)
        dispatch(this.commit('SET_APPROVAL_DATES', { approvalDates }))
      }
    },
    delete: (sessionTopic: string): AsyncAction => {
      return async (dispatch, getState) => {
        const approvalDates = (await Storage.wcApprovalDates.load()) ?? []

        const wcApprovalDate = approvalDates.find(it => it.sessionTopic === sessionTopic)

        if (wcApprovalDate) {
          const index = approvalDates.indexOf(wcApprovalDate)
          approvalDates.splice(index, 1)
        }
        await Storage.wcApprovalDates.save(approvalDates)
        dispatch(this.commit('SET_APPROVAL_DATES', { approvalDates }))
      }
    },
  }
}
