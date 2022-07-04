import type {ClassType} from 'class-transformer/ClassTransformer'

export type DataType<T> = ClassType<T> | T

export interface CallbackType {
  (name: string): void
}
