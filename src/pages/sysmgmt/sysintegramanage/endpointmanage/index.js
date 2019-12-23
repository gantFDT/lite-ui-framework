import React, { ReactElement, useCallback, useState, useRef, useMemo } from 'react'
import { Row, Col, Icon } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'

import ServiceList from './components/servicelist'
import CustomerList from './components/customerlist'
import OpenFunList from './components/openfunlist'
import LogFormModal from './components/LogFormModal'
import { Title } from '@/components/common';
import { getContentHeight } from '@/utils/utils'

import { IdsContext } from './context'

// import { SplitPane } from '@/components/layout'


const EndpointManage = (props) => {

  const {
    MAIN_CONFIG,
    route,
    selectedServiceRowKeys: [endpointId],
    selectedCustomerRowKeys: [systemId]
  } = props;
  const height = getContentHeight(MAIN_CONFIG, 2 + 40 + 20)

  const ids = useMemo(() => ({ endpointId, systemId }), [endpointId, systemId])

  return (
    <Card
      bodyStyle={{
        padding: 5,
      }}
      className="specialCardHeader"
      title={<Title route={route} />}
    >
      <Row gutter={0}>
        <Col span={8}>
          <div style={{ padding: 5 }}>
            <ServiceList route={route} />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ padding: 5 }}>
            <IdsContext.Provider value={ids}>
              <CustomerList
                endpointId={endpointId}
                route={route}
                contentHeight={height}
              />
              <OpenFunList
                systemId={systemId}
                route={route}
                contentHeight={height}
              />
            </IdsContext.Provider>
          </div>
        </Col>
      </Row>
      <LogFormModal />

      {/* <SplitPane
        leftWidthPercent={0.4}
        // rightWidthPercent={0.6}
        leftExpandWidthPercent={0.4}
        onSizeChange={onSizeChange}
        ref={thisRef}
        height={height}
        leftPane={
          <div style={{ padding: 10 }}>
            <ServiceList
              setEndpointId={setEndpointId}
              route={route}
              width={leftWidth}
            />
          </div>
        }
        centerPane={
          <div style={{ padding: 10, display: 'grid', gridTemplateRows: 'repeat(2, 50%)', gridAutoFlow: "column", height }}>
            <CustomerList
              endpointId={endpointId}
              setSelSystemId={setSelSystemId}
              route={route}
              contentHeight={height}
              width={centerWidth}
            />
            <OpenFunList
              systemId={selSystemId}
              route={route}
              contentHeight={height}
              width={centerWidth}
            />
          </div>
        }
      /> */}

    </Card>
  )
}

export default connect(
  ({ settings, endpointmanage }) => ({
    ...settings,
    ...endpointmanage
  })
)(EndpointManage)
