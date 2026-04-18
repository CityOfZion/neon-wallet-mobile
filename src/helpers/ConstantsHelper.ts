import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'

import type { TBlockchainServiceKey } from '@/types/blockchain'

// If you need to add more constants, please verify if they fit better in other helper or in your own helper.
export class ConstantsHelper {
  static readonly neonIconsUrl = 'https://raw.githubusercontent.com/CityOfZion/neon-icons/main'
  static readonly cozWebsiteUrl = 'https://coz.io'
  static readonly cozDiscordUrl = 'https://discord.gg/M7jGtEpjH4'
  static readonly cozPrivacyPolicyLink = 'https://www.coz.io/privacy-policy'

  static readonly footerHeight = 66

  static readonly neo3VoteCozPubKey = '02946248f71bdf14933e6735da9867e81cc9eea0b5895329aa7f71e7745cf40659'

  static readonly surveyExpiryMs = 90 * 24 * 60 * 60 * 1000 // 90 days

  static readonly fraudulentTokenHashesByBlockchain: Map<TBlockchainServiceKey, Set<string>> = new Map([
    ['neo3', new Set(['0x42e6b0379e39a428362e08cf9d7e40903cdb0fe7'])],
  ])

  static readonly tipPercentageBn = new BSBigHumanAmount('0.01') // 1%
  static readonly tipConfigByBlockchain = new Map([
    [
      'neo3',
      {
        address: 'Na6zQi9giUtftPGbLeFn9nfuWjEMP98Trq',
        token: BSNeo3Constants.GAS_TOKEN,
        minBn: new BSBigHumanAmount('0.00000001', BSNeo3Constants.GAS_TOKEN.decimals), // GAS has 8 decimals
      },
    ],
  ])
}
