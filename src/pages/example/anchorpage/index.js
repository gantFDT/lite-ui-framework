import React from 'react'
import { Anchor } from '@/components/common'
import { connect } from 'dva'
import OneContents from './components/OneContents'
import TwoContents from './components/TwoContents'
import ThreeContents from './components/ThreeContents'
import FourContents from './components/FourContents'

const anchorList = [
  {
    id: 'partone',
    title: tr('PartOne')
  },
  {
    id: 'parttwo',
    title: tr('PartTwo')
  },
  {
    id: 'partthree',
    title: tr('PartThree')
  },
  {
    id: 'partfour',
    title: tr('PartFour测试长度')
  },
]
function AnchorPage({ userId }) {
  return (
    <>
      <Anchor
        anchorKey='exampleAnchorpage'
        anchorList={anchorList}
        headerHeight={40}
        userId={userId}
        cardContent={
          <>
            <OneContents />
            <TwoContents />
            <ThreeContents />
            <FourContents />
          </>
        }
      />
    </>
  )
}

export default connect(
  ({ settings, user }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
  })
)(AnchorPage)