import { HttpExpose } from '@simpli/serialized-request'

export class WCApprovalDate {
  @HttpExpose()
  approvalDate = 0

  @HttpExpose()
  sessionTopic = ''
}
