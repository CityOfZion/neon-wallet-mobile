import { HttpExclude, HttpExpose } from '@simpli/serialized-request'
import i18n from 'i18n-js'

@HttpExclude()
export class PriorityFee {
  @HttpExpose()
  name: string

  @HttpExpose()
  fee: number

  constructor(fee: number, name?: string) {
    if (!name) {
      this.name = NoPriority().name
      if (fee < -0.05) {
        this.name = FastPriority().name
      } else if (fee < 0.1) {
        this.name = FasterPriority().name
      } else {
        this.name = FastestPriority().name
      }
    } else {
      this.name = name
    }
    this.fee = fee
  }

  equals(other: PriorityFee) {
    return this.name === other.name
  }
}

export const NoPriority = () => new PriorityFee(0, i18n.t('priorityFee.none'))
export const FastPriority = () => new PriorityFee(0.001, i18n.t('priorityFee.priorityFast'))
export const FasterPriority = () => new PriorityFee(0.05, i18n.t('priorityFee.priorityFaster'))
export const FastestPriority = () => new PriorityFee(0.1, i18n.t('priorityFee.priorityFastest'))
export const CustomPriotity = (value: number, text?: string) => new PriorityFee(value, text)
