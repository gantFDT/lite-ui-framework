import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'

import UserOperation from './useroperation'
import { Title } from '@/components/common';
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

const ImportUser = props => {
  const {
    MAIN_CONFIG,
    route
  } = props;
  const bodyHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)


  return (
    <>
      <Card
        className="specialCardHeader"
        title={<Title route={route} />}
        bodyStyle={{ padding: 0, height: bodyHeight }}
      >
        <UserOperation />
      </Card>
    </>
  )
}

export default connect(
  ({ settings, loading }) => ({
    ...settings,
  })
)(ImportUser)
