/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable import/export */
import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_UNLIMIT_MERCHANT_ID: z.string().nonempty(),
  EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL: z.url(),
  EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL: z.url(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
  EXPO_PUBLIC_GA_MEASUREMENT_ID: z.string().nonempty().optional(),
  EXPO_PUBLIC_GA_API_SECRET: z.string().nonempty().optional(),
})

type EnvSchema = z.infer<typeof envSchema>

class EnvHelperClass {
  static schema = envSchema

  static setup(): EnvSchema {
    const result = this.schema.parse(process.env) as EnvSchema
    Object.assign(this, result)
    return result
  }
}

// Cast the class to include all env properties
export const EnvHelper = EnvHelperClass as typeof EnvHelperClass & EnvSchema

export namespace EnvHelper {
  export type Schema = EnvSchema
}
