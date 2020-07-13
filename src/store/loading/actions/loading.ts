export const SET_LOADING = 'SET_LOADING'
export const SET_LOADING_PROGRESS = 'SET_LOADING_PROGRESS'
export const CLEAR_LOADING = 'CLEAR_LOADING'

export interface IAction {
  type: string
  progress: number
  loadingText: string
  isLoading: boolean
}

export const setLoading = (isLoading: boolean, loadingText: string) => {
  return {type: SET_LOADING, isLoading, loadingText}
}

export const setLoadingProgress = (progress: number) => {
  return {type: SET_LOADING_PROGRESS, progress}
}

export const clearLoading = () => {
  return {type: CLEAR_LOADING}
}
