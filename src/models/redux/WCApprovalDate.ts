import {HttpExpose} from '@simpli/serialized-request'
import moment from 'moment'

export class WCApprovalDate {
  @HttpExpose()
  approvalDate = 0

  @HttpExpose()
  sessionTopic = ''
}
