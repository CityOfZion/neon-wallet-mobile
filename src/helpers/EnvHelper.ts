/* eslint-disable @typescript-eslint/no-redeclare */

/* eslint-disable import/export */
import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_UNLIMIT_MERCHANT_ID: z.string().nonempty().optional(),
  EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL: z.url().optional(),
  EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL: z.url().optional(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
  EXPO_PUBLIC_GA_MEASUREMENT_ID: z.string().nonempty().optional(),
  EXPO_PUBLIC_GA_API_SECRET: z.string().nonempty().optional(),
  EXPO_PUBLIC_CLICK_UP_LIST_ID: z.string().nonempty().optional(),
  EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID: z.string().nonempty().optional(),
  EXPO_PUBLIC_CLICK_UP_API_KEY: z.string().nonempty().optional(),
})

type EnvSchema = z.infer<typeof envSchema>

class EnvHelperClass {
  static schema = envSchema

  static async setup() {
    const envVars: Record<keyof EnvSchema, any> = {
      EXPO_PUBLIC_UNLIMIT_MERCHANT_ID: process.env.EXPO_PUBLIC_UNLIMIT_MERCHANT_ID,
      EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL: process.env.EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL,
      EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL: process.env.EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL,
      EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
      EXPO_PUBLIC_GA_MEASUREMENT_ID: process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID,
      EXPO_PUBLIC_GA_API_SECRET: process.env.EXPO_PUBLIC_GA_API_SECRET,
      EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID: process.env.EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID,
      EXPO_PUBLIC_CLICK_UP_API_KEY: process.env.EXPO_PUBLIC_CLICK_UP_API_KEY,
      EXPO_PUBLIC_CLICK_UP_LIST_ID: process.env.EXPO_PUBLIC_CLICK_UP_LIST_ID,
    }

    const result = await this.schema.parseAsync(envVars)
    Object.assign(this, result)
    return result as EnvSchema
  }
}

// Cast the class to include all env properties
export const EnvHelper = EnvHelperClass as typeof EnvHelperClass & EnvSchema

export namespace EnvHelper {
  export type Schema = EnvSchema
}
