export type TAlertShowButtonOption = {
  onPress?: () => void
  label: string
}

export type TAlertShowOptions = {
  title?: string
  subtitle?: string
  buttons?: TAlertShowButtonOption[]
  hideable?: boolean
  onHide?: () => void
}

export type TAlertThis = {
  isShowing: boolean
  show: (options: TAlertShowOptions) => void
  hide: () => void
}

export type TQrCodeScanModalShowOptions = {
  onScan: (data: string) => void
}

export type TQrCodeScanModalThis = {
  isShowing: boolean
  show: (options: TQrCodeScanModalShowOptions) => void
}
