import type { ArgumentArray } from 'classnames'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

export class StyleHelper {
  static mergeStyles(...styles: ArgumentArray) {
    return twMerge(classNames(styles))
  }
}
