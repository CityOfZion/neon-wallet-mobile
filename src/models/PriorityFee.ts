import {HttpExclude, HttpExpose} from '@simpli/serialized-request'

import {Facade} from '~src/app/Facade'

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

export const NoPriority = () => new PriorityFee(0, Facade.t('priorityFee.none'))
export const FastPriority = () =>
  new PriorityFee(0.001, Facade.t('priorityFee.priorityFast'))
export const FasterPriority = () =>
  new PriorityFee(0.05, Facade.t('priorityFee.priorityFaster'))
export const FastestPriority = () =>
  new PriorityFee(0.1, Facade.t('priorityFee.priorityFastest'))
