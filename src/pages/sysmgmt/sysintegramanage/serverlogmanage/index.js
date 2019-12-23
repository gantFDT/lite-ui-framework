import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'
import ServerLogList from './components/serverloglist'

const ServerLogManage = props => {
  const {
    route
  } = props;

  return (
    <>
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <ServerLogList route={route} />
      </Card>
    </>
  )
}

export default connect(
  ({ settings, loading }) => ({
    ...settings
  })
)(ServerLogManage)
