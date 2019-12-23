import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Icon, Table } from 'gantd'
import Title from '@/components/common/title'
import { connect } from 'dva'
import { SmartModal } from '@/components/specific'

import { namespace } from '../../model'

const columns: any[] = [
  {
    dataIndex: 'id',
    title: tr('步骤编号'),
  },
  {
    dataIndex: 'name',
    title: tr('步骤名称'),
  },
  {
    dataIndex: 'action',
    title: tr('操作'),
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
    primaryColor,

    onCancel,
    onOk,
    value,
    visible
  } = props;

  const [sequences, setSequences] = useState<any[]>([])

  useEffect(() => {
    setSequences(value)
  }, [value])

  const handlerConfirm = useCallback(() => {
    onOk(sequences)
  },[sequences])

  const handlerMoveUp = useCallback((index: number) => {
    const prevItem = {...sequences[index - 1]};
    sequences[index - 1] = sequences[index];
    sequences.splice(index, 1, prevItem);
    setSequences([...sequences]);
  },[sequences])

  const handlerMoveDown = useCallback((index: number) => {
    const nextItem = {...sequences[index + 1]};
    sequences[index + 1] = sequences[index];
    sequences.splice(index, 1, nextItem);
    setSequences([...sequences]);
  },[sequences])
  
  const fakeColumns = useMemo(() => {
    columns[2].render = (text: string, record: any, index: number) => <span style={{color: primaryColor}}>
      {!!index && <Icon type="icon-shangyi" onClick={() => handlerMoveUp(index)} style={{marginRight: 5}}/>}
      {sequences.length - 1 !== index && <Icon onClick={() => handlerMoveDown(index)} type="icon-xiayi"/>}
    </span>
    return [...columns]
  },[columns, sequences])
  
  return (
    <SmartModal
        id="SequenceSelectorModal"
        title={tr('调整流程步骤顺序')}
        isModalDialog
        maxZIndex={12}
        itemState={{
          width: 1024,
          height: 768
        }}
        visible={visible}
        onSubmit={handlerConfirm}
        onCancel={onCancel}
      >
        <Table
          title={<Title
            title={tr('流程步骤顺序')}
            showShortLine
          />}
          columns={fakeColumns}
          dataSource={sequences}
          rowKey="id"

          pagination={false}
        />
      </SmartModal>
  )
}

const ModalWithDva = connect(
  ({ loading, settings, workFlowDesigner, user }: any) => ({
    currentUser: user.currentUser,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    ...workFlowDesigner,
    loading: loading.effects[namespace + '/listCallbackFunctions'],
  }),
  (dispatch: any) => ({
    listCallbackFunctions: (payload: any) => dispatch({type:namespace + '/listCallbackFunctions', payload}),
  })
)(SelectorModal);

export default ModalWithDva;