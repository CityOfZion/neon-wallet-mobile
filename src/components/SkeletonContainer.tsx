import React from 'react'
import { Dimensions } from 'react-native'
import Sekeleton from 'react-native-skeleton-content'
import { ICustomViewStyle } from 'react-native-skeleton-content/lib/Constants'

type TTypeSkeleton =
  | 'balanceWallet'
  | 'balanceAccountIsCompacted'
  | 'balanceAccount'
  | 'balanceList'
  | 'assetDetail'
  | 'transactionList'
interface ISkeletonContainer {
  isLoading: boolean
  skeletonType: TTypeSkeleton
  boneColor?: string
}

const SkeletonContainer: React.FC<ISkeletonContainer> = ({ children, skeletonType, boneColor, isLoading }) => {
  const typedSkeleton: Record<TTypeSkeleton, ICustomViewStyle[]> = {
    balanceWallet: [{ width: 150, minHeight: 56, marginBottom: Dimensions.get('screen').height * 0.08 }],
    balanceAccountIsCompacted: [
      {
        width: 60,
        height: 30,
        position: 'absolute',
        bottom: Dimensions.get('screen').width * 0.0001,
        right: Dimensions.get('screen').width * 0.001,
      },
    ],
    balanceAccount: [{ width: '80%', height: '80%', alignSelf: 'center' }],
    balanceList: [{ width: 40, height: 20 }],
    assetDetail: [{ width: 100, height: 30 }],
    transactionList: [{ width: 50, height: 20, marginLeft: Dimensions.get('screen').width * 0.3 }],
  }

  return (
    <Sekeleton
      containerStyle={{
        width: '100%',
        alignItems: 'center',
      }}
      boneColor={boneColor ?? 'transparent'}
      highlightColor="#ffffff55"
      isLoading={isLoading}
      layout={typedSkeleton[skeletonType]}
    >
      {children}
    </Sekeleton>
  )
}

export default SkeletonContainer;
