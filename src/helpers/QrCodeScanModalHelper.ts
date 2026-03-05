import { activatedQrCode } from '@/components/QrCodeScanModal'

import type { TQrCodeScanModalShowOptions } from '@/types/components'

export class QrCodeScanModalHelper {
  static show(options: TQrCodeScanModalShowOptions) {
    if (!activatedQrCode) return
    activatedQrCode.show(options)
  }
}
