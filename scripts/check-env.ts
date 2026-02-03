import { config } from 'dotenv'
import { z } from 'zod'

import { EnvHelper } from '@/helpers/EnvHelper'

config()

const result = EnvHelper.schema.required().safeParse(process.env)
if (!result.success) {
  console.error('❌ Environment variable validation failed:')
  console.error(z.treeifyError(result.error))
  process.exit(1)
} else {
  console.log('✅ Environment variables are valid.')
}
