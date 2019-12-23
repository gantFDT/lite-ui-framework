import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Spin, Row, Col } from 'antd'

import { APIContext } from '../context'
import Template from './template'

const layout = {
  xs: 12,
  md: 8,
  xl: 4
}

export default (props) => {

  const [loading, setloading] = useState(false)
  const [list, setlist] = useState([])
  const { api } = useContext(APIContext)

  const queryList = useCallback(
    () => {
      setloading(true)
      api.callRemote({
        type: 'gantui/getTemplates'
      }).then(res => {
        setlist(res)
        setloading(false)
      })
    },
    [],
  )

  useEffect(() => {
    queryList()
  }, [])
  if (loading) return (
    <div style={{
      "text-align": "center",
      "border-radius": 4,
      "margin-bottom": 20,
      "padding": "30px 50px",
      margin: "20px 0"
    }}>
      <Spin />
    </div>
  )
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {
          list.map(config => (
            <Col {...layout}>
              <Template {...config} />
            </Col>
          ))
        }
      </Row>
    </div>
  )
}