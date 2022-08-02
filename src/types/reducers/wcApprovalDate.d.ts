import { WCApprovalDate } from '~src/models/redux/WCApprovalDate'

export interface WCState {
  approvalDates: WCApprovalDate[]
  dappConnectionStart: boolean
}
