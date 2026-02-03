import { useAppSelector } from '@/hooks/useRedux'

export const useSwapRecordsSelector = () => {
  const { ref: swapRecordsRef, value: swapRecords } = useAppSelector(state => state.utility.data.swapRecords)

  return { swapRecords, swapRecordsRef }
}
