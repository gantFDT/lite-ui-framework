import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'
import ClientLogList from './components/clientloglist'

const ClientLogManage = props => {
  const {
    MAIN_CONFIG,
    route
  } = props;

  return (
    <>
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <ClientLogList route={route} />
      </Card>
    </>
  )
}

export default connect(
  ({ settings, loading }) => ({
    ...settings,
  })
)(ClientLogManage)
