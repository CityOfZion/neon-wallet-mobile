import type { ArgumentArray } from 'classnames'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../tailwind.config'

const resolvedTailwindConfig = resolveConfig(tailwindConfig)

export class StyleHelper {
  static mergeStyles(...styles: ArgumentArray) {
    return twMerge(classNames(styles))
  }

  static extractTailwindValue(attibute: string, classNames?: string) {
    if (!classNames?.includes(attibute)) return null

    const regex = new RegExp(`${attibute}-([a-zA-Z0-9-]+)`)
    const match = classNames.match(regex)
    const value = match?.[1]

    if (!value) return null

    // Walk nested color map: e.g. "gray-200" → colors.gray["200"]
    const parts = value.split('-')
    let resolved: unknown = resolvedTailwindConfig.theme.colors

    for (const part of parts) {
      if (resolved == null || typeof resolved !== 'object') return null
      resolved = (resolved as Record<string, unknown>)[part]
    }

    if (!resolved) return null
    if (typeof resolved === 'string') return resolved
    if (typeof resolved === 'object' && 'DEFAULT' in resolved) return (resolved as Record<string, string>).DEFAULT

    return null
  }
}
