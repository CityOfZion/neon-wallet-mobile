import {Facade} from '~src/app/Facade'

export class PriorityFee {
  name: string
  fee: number

  constructor(name: string, fee: number) {
    this.name = name
    this.fee = fee
  }

  equals(other: PriorityFee) {
    return this.name === other.name
  }
}

export const NoPriority = () => new PriorityFee('none', 0)
export const FastPriority = () =>
  new PriorityFee(Facade.t('modals.send.transactionInput.priorityFast'), 0.001)
export const FasterPriority = () =>
  new PriorityFee(Facade.t('modals.send.transactionInput.priorityFaster'), 0.05)
export const FastestPriority = () =>
  new PriorityFee(Facade.t('modals.send.transactionInput.priorityFastest'), 0.1)
