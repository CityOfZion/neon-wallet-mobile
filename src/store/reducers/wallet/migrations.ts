export function getWalletsMigrations() {
  return {
    0: (state: any) => {
      return {
        ...state,
        data: state.data.map((it: any) => ({ ...it, type: it.walletType, walletType: undefined })),
      }
    },
    1: (state: any) => {
      return {
        ...state,
        data: state.data.map((it: any) => ({
          ...it,
          type: it.type === 'legacy' || it.type === 'watch' ? 'non-standard' : 'standard',
        })),
      }
    },
    2: (state: any) => {
      return {
        ...state,
        data: state.data.map((it: any) => ({
          ...it,
          backupStatus: it.type === 'hardware' ? 'successful' : it.backupStatus,
        })),
      }
    },
    3: (state: any) => {
      return {
        ...state,
        data: state.data.map((it: any) => ({
          ...it,
          backupStatus: it.type === 'standard' ? it.backupStatus : 'successful',
        })),
      }
    },
  }
}
