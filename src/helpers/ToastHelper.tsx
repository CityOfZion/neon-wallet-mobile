import { toasterContext } from '@/components/Toaster'
import { ErrorToast, InfoToast, LoadingToast, SuccessToast } from '@/components/Toaster/Toasts'

import { UtilsHelper } from './UtilsHelper'

import type { TToastHelperParams } from '@/types/helpers'

export class ToastHelper {
  static #defaultDuration = 5000

  static error(params: TToastHelperParams) {
    if (!toasterContext) return

    toasterContext.add({ id: UtilsHelper.uuid(), duration: this.#defaultDuration, ...params, component: ErrorToast })
  }

  static success(params: TToastHelperParams) {
    if (!toasterContext) return

    toasterContext.add({ id: UtilsHelper.uuid(), duration: this.#defaultDuration, ...params, component: SuccessToast })
  }

  static info(params: TToastHelperParams) {
    if (!toasterContext) return

    toasterContext.add({ id: UtilsHelper.uuid(), duration: this.#defaultDuration, ...params, component: InfoToast })
  }

  static loading(params: TToastHelperParams) {
    if (!toasterContext) return

    toasterContext.add({
      id: UtilsHelper.uuid(),
      ...params,
      duration: Infinity,
      component: LoadingToast,
    })
  }

  static dismiss(id: string) {
    if (!toasterContext) return
    toasterContext.dismiss(id)
  }
}
