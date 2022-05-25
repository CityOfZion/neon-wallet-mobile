import {ReducerWrapper} from '@simpli/redux-wrapper'
import moment from 'moment'

import {SetApprovalDateDispatcher} from './dispatchers/SetApprovalDateDispatcher'

import {Model} from '~/src/app/Model'
import {Storage} from '~src/app/Storage'
import {WCApprovalDate} from '~src/models/redux/WCApprovalDate'

export class WalletConnectReducer extends ReducerWrapper<
  WCActionsType,
  WCState,
  WCAction
> {
  protected readonly initialState = Model.parse<WCState>(WCApprovalDate)

  protected readonly dispatchers = [SetApprovalDateDispatcher]

  readonly actions = {
    setApprovalDate: (approvalDates: WCApprovalDate[]) => {
      return this.commit('SET_APPROVAL_DATES', {approvalDates})
    },
    updateApprovalDate: (sessionTopic: string): AsyncAction => {
      return async (dispatch, getState) => {
        const approvalDates = (await Storage.wcApprovalDates.load()) ?? []
        approvalDates.push({sessionTopic, approvalDate: moment().unix()})
        await Storage.wcApprovalDates.save(approvalDates)
      }
    },
    delete: (sessionTopic: string): AsyncAction => {
      return async (dispatch, getState) => {
        const wcApprovalDates = (await Storage.wcApprovalDates.load()) ?? []

        const wcApprovalDate = wcApprovalDates.find(
          (it) => it.sessionTopic === sessionTopic
        )

        if (wcApprovalDate) {
          const index = wcApprovalDates.indexOf(wcApprovalDate)
          wcApprovalDates.splice(index, 1)
        }
        await Storage.wcApprovalDates.save(wcApprovalDates)
      }
    },
  }
}
