import { ConstantsHelper } from './ConstantsHelper'
import { NumberHelper } from './NumberHelper'

import type { TSkinHelperLocalSkin } from '@/types/helpers'

export class SkinHelper {
  static readonly accountColorSkinsSet = new Set([
    '#00ddb4',
    '#22b1ff',
    '#7c4bfe',
    '#d355e7',
    '#fe872f',
    '#fedd5b',
    '#91abbc',
  ])

  static readonly accountLocalSkins: Map<string, TSkinHelperLocalSkin> = new Map([
    [
      'coz-face-december-2024',
      {
        blockchain: 'neo3',
        collectionHash: '0x76a8f8a7a901b29a33013b469949f4b08db15756',
        imageUrl: `${ConstantsHelper.neonIconsUrl}/skins/coz-face-december-2024.png`,
      },
    ],
    [
      'neo-christmas-2024',
      {
        blockchain: 'neox',
        collectionHash: '0x6e8789d940928e656ea47941ed93b0596dd40056',
        imageUrl: `${ConstantsHelper.neonIconsUrl}/skins/neo-christmas-2024.png`,
      },
    ],
  ])

  static readonly localSkins = new Map(this.accountLocalSkins)

  static getSkinColor(index?: number) {
    const newIndex = index ?? NumberHelper.getRandomNumber(this.accountColorSkinsSet.size)
    const colors = Array.from(this.accountColorSkinsSet.values())
    return colors[newIndex] ?? colors[0]
  }

  static isColorSkin(value: string) {
    return this.accountColorSkinsSet.has(value)
  }
}
