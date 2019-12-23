import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'
import OrgOperation from './orgoperation'
import { Title } from '@/components/common';
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'


const ImportOrg = props => {
  const {
    MAIN_CONFIG,
    route
  } = props;
  const bodyHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)

  return (
    <Card
      title={<Title route={route} />}
      className="specialCardHeader"
      bodyStyle={{ padding: 0, height: bodyHeight }}
    >
      <OrgOperation />
    </Card>
  )
}

export default connect(
  ({ settings, loading }) => ({
    ...settings,
  })
)(ImportOrg)
