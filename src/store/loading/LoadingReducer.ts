import {
  IAction as ILoadingAction,
  SET_LOADING,
  SET_LOADING_PROGRESS,
  CLEAR_LOADING,
} from '~src/store/loading/actions/loading'

interface ILoadingState {
  progress: number
  loadingText: string
  isLoading: boolean
}

const loadingState: ILoadingState = {
  progress: 0,
  loadingText: '',
  isLoading: false,
}

const loading = (
  state: ILoadingState = loadingState,
  action: ILoadingAction
) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
        loadingText: action.loadingText,
      }
    case SET_LOADING_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      }
    case CLEAR_LOADING:
      return {
        ...state,
        isLoading: false,
        progress: 0,
        loadingText: '',
      }
    default:
      return state
  }
}

export default loading
