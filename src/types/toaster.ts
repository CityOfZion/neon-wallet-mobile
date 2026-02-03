import type { ComponentType } from 'react'

export type TToasterComponentProps = {
  message: string
}

export type TToasterToastOptions = {
  id: string
  duration: number
  component: ComponentType<TToasterComponentProps>
} & TToasterComponentProps
