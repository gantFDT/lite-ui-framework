import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Tooltip, Button, Tabs, Modal, Row, Col } from 'antd'
import { Table, BlockHeader, Card } from 'gantd'
import { connect } from 'dva'
// import { Controlled as CodeMirror } from 'react-codemirror2'
import { Title } from '@/components/common'
import { getContentHeight } from '@/utils/utils'

// require('codemirror/mode/sql/sql')
// require('codemirror/lib/codemirror.css')
// require('codemirror/theme/3024-day.css')

const { TabPane } = Tabs

const PREFFIX = `${window.location.origin}/api/static/v4pc/sysmgmt`
const DUI_GOU = `${PREFFIX}/resources/images/workflow/duigou.png`
const WEI_LAI = `${PREFFIX}/resources/images/workflow/weilai.png`

const EDITOR_OPTIONS = {
  mode: {
    name: 'sql',
    json: true
  },
  theme: '3024-day',
  lineNumbers: true
}

/**
 * 平台管理-图形数据库维护
 */
export default connect(({ settings, graphDb, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  graphDbEnabled: graphDb.graphDbEnabled,
  graphSchemaList: graphDb.graphSchemaList,
  result: graphDb.result,
  graphDbEnabledLoading: loading.effects['graphDb/getGraphDbEnabled'],
  selectedNames: graphDb.selectedNames
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    graphDbEnabled,
    graphSchemaList,
    graphDbEnabledLoading,
    result,
    route
  } = props

  const [sql, setSql] = useState('')
  const editorRef1 = useRef({})
  const editorRef2 = useRef({})
  const tableHeight = getContentHeight(MAIN_CONFIG, 40 + 36 + 40 + 29 + 2 + 20 + 10)
  const editorHeight = getContentHeight(MAIN_CONFIG, 40 + 36 + 40 + 20 + 10)
  useMemo(() => {
    if (editorRef1.current.setSize) {
      editorRef1.current.setSize('auto', editorHeight)
    }
    if (editorRef2.current.setSize) {
      editorRef1.current.setSize('auto', editorHeight)
    }
  }, [editorHeight])

  const getGraphDbEnabled = () => {
    dispatch({ type: 'graphDb/getGraphDbEnabled' })
  }

  useEffect(() => {
    getGraphDbEnabled()
  }, [])

  const initDgraph = () => {
    Modal.confirm({
      title: tr('是否执行同步数据操作?'),
      content: tr('初始化操作将清空当前图数据库所有数据'),
      maskClosable: true,
      cancelText: tr('取消'),
      centered: true,
      okText: tr('确认'),
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      onOk() {
        return dispatch({
          type: 'graphDb/initDgraph'
        })
      },
      onCancel() {
      }
    })
  }

  const queryDgraph = useCallback(() => {
    dispatch({
      type: 'graphDb/queryDgraph',
      payload: {
        sql
      }
    })
  }, [sql])

  const onEditor1Mount = useCallback((editor: any) => {
    editorRef1.current = editor
    if (editor && editor.setSize) {
      editor.setSize('auto', editorHeight)
    }
  }, [])

  const onEditor2Mount = useCallback((editor: any) => {
    editorRef2.current = editor
    if (editor && editor.setSize) {
      editor.setSize('auto', editorHeight)
    }
  }, [])

  const clearResult = useCallback(() => {
    dispatch({
      type: 'graphDb/updateState',
      payload: {
        result: ''
      }
    })
  }, [])

  return (
    <Card
      title={<Title route={route} />}
      bodyStyle={{ padding: '10px' }}
      extra={(
        <span style={{ padding: '0 10px' }}>{graphDbEnabled ? tr('提示：图数据库已配置连接') : tr('提示：图数据库连接未配置')}</span>
      )}
      className='specialCardHeader'
    >
      <Tabs defaultActiveKey="1" animated={false}>
        <TabPane tab={tr('模式')} key="1">
          <Table
            title={tr('图形数据库模式')}
            headerRight={(
              <>
                <Button
                  size='small'
                  icon='interaction'
                  disabled={!graphDbEnabled}
                  onClick={initDgraph}>{tr('初始化图数据库')}</Button>
                <Tooltip title={tr('刷新')}>
                  <Button
                    size='small'
                    icon='reload'
                    disabled={!graphDbEnabled}
                    onClick={getGraphDbEnabled.bind(null, true)}
                  />
                </Tooltip>
              </>
            )}
            resizeCell={false}
            rowKey='name'
            loading={graphDbEnabledLoading}
            dataSource={graphSchemaList}
            columns={Columns}
            scroll={{ y: tableHeight }}
          />
        </TabPane>
        <TabPane tab={tr('查询')} key="2">
          <Row gutter={10}>
            <Col span={12}>
              <BlockHeader
                type=''
                title={tr('查询语句')}
                extra={(
                  <>
                    <Button
                      size='small'
                      icon='search'
                      disabled={!graphDbEnabled}
                      onClick={queryDgraph}
                    >{tr('执行查询')}</Button>
                    <Button
                      size='small'
                      icon='close'
                      disabled={!graphDbEnabled}
                      onClick={() => setSql('')}
                    >{tr('清空语句')}</Button>
                  </>
                )}
              />
              {/* <CodeMirror
                autoCursor
                value={sql}
                options={EDITOR_OPTIONS}
                onBeforeChange={(editor, data, value: string) => {
                  setSql(value)
                }}
                editorDidMount={onEditor1Mount}
              /> */}
            </Col>
            <Col span={12}>
              <BlockHeader
                type=''
                title={tr('查询结果')}
                extra={<Button
                  size='small'
                  icon='close'
                  disabled={!graphDbEnabled}
                  onClick={clearResult}
                >{tr('清空结果')}</Button>}
              />
              {/* <CodeMirror
                value={result}
                options={{
                  ...EDITOR_OPTIONS,
                  readOnly: true
                }}
                onBeforeChange={(editor, data, value: string) => {
                  setSql(value)
                }}
                editorDidMount={onEditor2Mount}
              /> */}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  )
})

const ImageRender = (value: boolean) => (
  <img
    style={{ verticalAlign: 'middle' }}
    alt={tr('图片未出现')}
    src={value ? DUI_GOU : WEI_LAI}
  />
)

const Columns = [
  {
    title: tr('Predicate'),
    dataIndex: 'predicate',
    width: 180
  },
  {
    title: tr('Type'),
    dataIndex: 'type',
    width: 80
  },
  {
    title: tr('Index'),
    dataIndex: 'index',
    width: 80,
    render: ImageRender
  },
  {
    title: tr('Reverse'),
    dataIndex: 'reverse',
    width: 80,
    render: ImageRender
  },
  {
    title: tr('Count'),
    dataIndex: 'count',
    width: 80,
    render: ImageRender
  },
  {
    title: tr('Upsert'),
    dataIndex: 'upsert',
    width: 80,
    render: ImageRender
  },
  {
    title: tr('Lang'),
    dataIndex: 'lang',
    width: 80,
    render: ImageRender
  },
  {
    title: tr('Tokenizers'),
    dataIndex: 'tokenizers',
    width: 200
  },
  {
    title: tr('RDF'),
    dataIndex: 'createRDF'
  }
]
