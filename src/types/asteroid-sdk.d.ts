declare module '~src/vendor/asteroid-sdk' {
  import type * as SDKType from '@moonlight-io/asteroid-sdk-js'
  const SDK: typeof SDKType = require('~src/vendor/asteroid-sdk')

  export default SDK
}
