import { ClassTransformOptions } from 'class-transformer'
import type { DataType } from './types'
import type { DataStorage } from './DataStorage'
export declare class DataResult<T = any> {
  constructor(dataStore: DataStorage, dataType?: DataType<T>)
  private readonly dataStore
  readonly dataType?: DataType<T>
  erase(): Promise<void>
  save(data: T, options?: ClassTransformOptions): Promise<void>
  load(options?: ClassTransformOptions): Promise<T | null>
}
