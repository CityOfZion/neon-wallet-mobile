import 'i18next'

import type { enResources } from '@/locales/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: typeof enResources
  }
}
