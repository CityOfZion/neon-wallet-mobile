import type {ClassType} from 'class-transformer/ClassTransformer'
export declare type DataType<T> = ClassType<T> | T
export interface CallbackType {
  (name: string): void
}
