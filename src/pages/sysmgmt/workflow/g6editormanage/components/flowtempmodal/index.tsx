import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Spin } from 'antd'
import { Table } from 'gantd'
import { debounce } from 'lodash'
import { connect } from 'dva'
import { SmartModal } from '@/components/specific'
import { Title } from '@/components/common'
import FlowDetail from '@/components/specific/workflow/flowdetail'
import styles from './index.less'

import { namespace } from '../../model'

const columns: any[] = [
  {
    dataIndex: 'nameVersion',
    title: tr('流程模板名称'),
  },
  {
    dataIndex: 'status',
    title: tr('状态'),
  },
]

interface SelectorModalProps {
  visible: boolean,
  onCancel: () => void,
  onOk: (data: object) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const {
    currentUser,
    onlyRowData,

    workflowTemplates,

    listFlowTemp,
    listSubFlowTemp,
    getDeployTemplate,

    loading,
    loadingDetail,
    visible,
    onClose,
    onOk
  } = props;

  const [modalVisible, setModalVisible] = useState(false)
  const [flowSize, setFlowSize] = useState<any>({ width: 0, height: 0 })
  const [flowData, setFlowData] = useState({})

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([])
      setSelectedRows([])
      listFlowTemp()
    }
  }, [visible])

  const handlerExpand = useCallback((expanded: boolean, record: any) => {
    if (expanded && !record.children.length) {
      listSubFlowTemp({ node: record.id })
    }
  }, [])

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }, [setSelectedRowKeys, setSelectedRows])

  const handlerConfirm = useCallback(() => {
    const [{ contentId }] = selectedRows;
    if (onlyRowData) {
      return onOk(selectedRows[0]);
    }
    getDeployTemplate({ contentId }).then((data: any) => {
      onOk({
        ...data,
        designId: null,
        designName: null
      });
    })
  }, [selectedRows, onlyRowData])

  const showFlowModal = useCallback((id) => {
    setModalVisible(true)
    getDeployTemplate({ contentId: id }).then((data: any) => {
      setFlowData(data)
    })
  }, [])

  const fakeColumns = useMemo(() => {
    columns[0].render = (text: string, record: any) => <a onClick={() => showFlowModal(record.contentId)}>{text}</a>
    return [...columns]
  }, [columns])

  const handlerModalSizeChange = useCallback(debounce((width: number, height: number) => {
    setFlowSize({ width, height: height - 86 })
  }, 200), [])

  const flowTempName = useMemo(() => selectedRows.length ? selectedRows[0].nameVersion : '', [selectedRows])

  return (
    <>
      <SmartModal
        id="FlowTempModal"
        title={tr('已部署流程模板选择')}
        isModalDialog
        maxZIndex={12}
        itemState={{
          width: 1024,
          height: 660
        }}
        confirmLoading={loadingDetail}
        visible={visible}
        onSubmit={handlerConfirm}
        onCancel={() => onClose()}
      >
        <Table
          title={<Title title={tr('已部署流程模板列表')} showShortLine />}
          columns={fakeColumns}
          dataSource={workflowTemplates}
          rowKey="id"
          onExpand={handlerExpand}

          rowSelection={{
            clickable: true,
            type: 'radio',
            selectedRowKeys,
            onChange: handlerSelect
          }}

          loading={loading}

          pagination={false}
        />
      </SmartModal>

      <SmartModal
        id="flowTempModal"
        title={tr('流程模板') + ' - ' + flowTempName}
        visible={modalVisible}
        itemState={{
          width: 960,
          height: 600,
        }}
        footer={null}
        onCancel={() => { setModalVisible(false) }}
        onSizeChange={handlerModalSizeChange}
      >
        <div className={styles.modalWrapper}>
          {
            loadingDetail ? <Spin /> : <FlowDetail dataSource={flowData} width={flowSize.width} height={flowSize.height} />
          }
        </div>
      </SmartModal>
    </>
  )
}

const ModalWithDva = connect(
  ({ loading, settings, workFlowDesigner, user }: any) => ({
    currentUser: user.currentUser,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    ...workFlowDesigner,
    loading: loading.effects[namespace + '/listFlowTemp'] || loading.effects[namespace + '/listSubFlowTemp'],
    loadingDetail: loading.effects[namespace + '/getDeployTemplate'],
  }),
  (dispatch: any) => ({
    listFlowTemp: (payload: any) => dispatch({ type: namespace + '/listFlowTemp', payload }),
    listSubFlowTemp: (payload: any) => dispatch({ type: namespace + '/listSubFlowTemp', payload }),
    getDeployTemplate: (payload: any) => dispatch({ type: namespace + '/getDeployTemplate', payload }),
  })
)(SelectorModal);

export default ModalWithDva;