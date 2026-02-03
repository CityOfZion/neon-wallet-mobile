import { activatedAlert } from '@/components/Alert'

import type { TAlertShowOptions } from '@/types/components'

export class AlertHelper {
  static show(options: TAlertShowOptions) {
    if (!activatedAlert) return
    activatedAlert.show(options)
  }

  static hide() {
    if (!activatedAlert) return
    activatedAlert.hide()
  }
}
