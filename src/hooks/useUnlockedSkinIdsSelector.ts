import { useAppSelector } from '@/hooks/useRedux'

export const useUnlockedSkinIdsSelector = () => {
  const { value: unlockedSkinIds, ref: unlockedSkinIdsRef } = useAppSelector(
    state => state.utility.data.unlockedSkinIds
  )

  return { unlockedSkinIds, unlockedSkinIdsRef }
}
