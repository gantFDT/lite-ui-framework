import React, { useState, useEffect, useMemo, useCallback, useReducer, useRef } from 'react';
import { Button, Tooltip, Modal, message, Menu, Row, Col, Drawer, Input, Switch, Steps, Select, Checkbox, Empty, Popconfirm } from 'antd';
import { connect } from 'dva';
import { BlockHeader, Icon, Table } from 'gantd';
import styles from './style.less';
import { tr, Card } from '@/components/common'
import { SearchTable, SmartModal } from '@/components/specific'
import { reducer, getTableHeight } from '@/utils/utils'

const { confirm } = Modal;
const { Step } = Steps;
const { Option } = Select;

const Targets = props => {
  const {
    MAIN_CONFIG, data, currentUser, loading, modalVisible,
    allDomains, dataAcls, activeDataAcl = {}, filters, actions, domainFilters = [], actionData, activeFilter, domainTargets,
    getAllDomains, getDataAcls, getDomainFilters, getDomainActions, saveDataAcls, refreshDataSecurity, save, getDomainTargets,
    onClose, visible, modalFilterVisible, modalTargetVisible,
    generateTaregetLabel, registerTarget, registerDomain, registerAction, registerFilter,
    height
  } = props;
  const minHeight = getTableHeight(MAIN_CONFIG, 10);
  const [targetCreateVisible, setTargetCreateVisible] = useState(false)
  const [targetEditVisible, setTargetEditVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState()

  const [tableHei, setTableHei] = useState(300)

  const thisRef = useRef()

  // 统筹一些数据
  const [state, dispatch] = useReducer(reducer, {
    stepCurrent: 0,
    activeCreateTarget: {},
    activeCreateTargetView: {},
    activeEditTargetView: {}
  })
  const { stepCurrent, activeCreateTarget = {}, activeCreateTargetView = {}, activeEditTargetView = {} } = state;


  const getTargetContent = (simpleTarget) => {
    const targetContent = registerTarget.find((item) => {
      return item.code == simpleTarget.code;
    });
    console.log('targetContent', targetContent)
    return { ...simpleTarget, ...targetContent }
  }


  // 把targets转换为action数据
  const translateTargetsToActionData = (targets) => {
    const actionsData = []
    targets.map((item, index, array) => {
      if (!item.parameterValue) { item.parameterValue = '' }
      const actionData = {

        // target: generateTaregetLabel(item.code, item.parameterValue),
        code: item.code,
        view: item.view,
        label: item.label,
        parameterValue: item.parameterValue || '',
        id: index
      }
      const { actions } = item;
      actions.map((action) => {
        actionData[action.code] = action.authorize;
      })
      actionsData.push(actionData)
    })
    return actionsData;
  }

  // 打开新增授权目标窗口
  const handleCreateTargetClick = useCallback(() => {
    setTargetCreateVisible(true)
    getDomainTargets({
      domainCode: activeDataAcl.code
    })
  }, [setTargetCreateVisible, getDomainTargets, activeDataAcl])






  // 新建时授权目标选择改变
  const handleTargetSelectorChange = (value, item) => {
    dispatch({
      type: 'save',
      payload: {
        activeCreateTarget: {
          code: value,
          label: item.props.name,
          view: item.props.view,
          parameterValue: ""
        },
        activeCreateTargetView: item.props.view ? React.createElement(item.props.view, { viewRef: thisRef, tableHei }) : null
      }
    })
  }




  // 创建授权目标
  const handleCreateTarget = useCallback(() => {
    let parameterValue = thisRef.current ? thisRef.current.getValues() : '';
    if (parameterValue) {
      const { selectedRowKeys, selectedRows } = parameterValue
      parameterValue = selectedRowKeys[0]
    }

    activeCreateTarget.parameterValue = parameterValue
    activeCreateTarget.actions = []
    actions.map((item, index, array) => {
      let authorize = 'NONE'
      if (item.code == 'READ') {
        authorize = 'ENABLE'
      }
      activeCreateTarget.actions.push({
        code: item.code,
        authorize,

      })
    })
    const activeFilterTemp = _.cloneDeep(activeFilter)
    const targets = _.cloneDeep(activeFilterTemp.targets)
    targets.map((item, index, arr) => {
      targets[index] = getTargetContent(item)
    })
    activeFilterTemp.targets = targets
    activeFilterTemp.targets.push(activeCreateTarget)
    const actionData = translateTargetsToActionData(activeFilterTemp.targets)
    setTargetCreateVisible(false)
    save({
      activeFilter: activeFilterTemp,
      actionData
    })
    dispatch({
      type: 'save',
      payload: {
        activeCreateTarget: {},
        stepCurrent: 0
      }
    })
  }, [activeCreateTarget, actions, activeFilter, actionData, translateTargetsToActionData])

  // 关闭授权目标创建
  const cancelTargetCreate = useCallback(() => {
    dispatch({
      type: 'save',
      payload: {
        activeCreateTarget: {},
        stepCurrent: 0
      }
    })
    setTargetCreateVisible(false)
  }, [])

  // 权限 action 改变
  const actionChange = useCallback((key, value, record) => {
    const { id } = record;
    switch (value) {
      case 'NONE':
        value = "ENABLE"
        break;
      case 'ENABLE':
        value = "DISABLE"
        break;
      case 'DISABLE':
        value = "NONE"
        break;
      default:
        break;
    }
    const actionDataTemp = _.cloneDeep(actionData);
    actionDataTemp.map((item) => {
      if (item.id == id) {
        item[key] = value
      }
    })
    save({
      actionData: actionDataTemp
    })
  }, [actionData])

  // 授权目标动态列
  const TargetColumns = useMemo(() => {
    // 授权目标定义
    const schemaTarget = [{
      key: 'label',
      dataIndex: 'label',
      title: tr('授权目标'),
      width: 180,
      fixed: 'left',
      render(value, record, index) {
        if (typeof (value) !== 'function') { return '' }
        return <div className="dynamic_action_button_wrap">
          <div className="dynamic_action_text">{value(record.parameterValue)}</div>
          <Icon.Ant type="edit" className="dynamic_action_icon" onClick={() => handleEditClick(record)} />
          <Popconfirm
            title={`${tr('确定删除')}？`}
            okText={tr('确定')}
            cancelText={tr('取消')}
            onConfirm={() => handlerRemove([record])}
            okButtonProps={{
              type: 'danger'
            }}
          >
            <Icon.Ant type="delete" className="dynamic_action_icon" />
          </Popconfirm>
        </div>
      }
    }]
    actions.map((item) => {
      schemaTarget.push({
        key: item.code,
        dataIndex: item.code,
        title: item.label,
        align: 'center',
        width: 100,
        render(text, record, index) {
          return <>
            {text == "ENABLE" && <Icon.Ant type='check-circle' className={styles.actionIcon} onClick={() => actionChange(item.code, text, record)} />}
            {text == "NONE" && <Icon type='icon-Radio1' className={styles.actionIcon} onClick={() => actionChange(item.code, text, record)} />}
            {text == "DISABLE" && <Icon.Ant type='close-circle' className={styles.actionIcon} style={{ color: '#f00' }} onClick={() => actionChange(item.code, text, record)} />}
          </>
        }
      })
    })
    return schemaTarget;
  }, [actions, actionChange])

  // 点击edit
  const handleEditClick = useCallback((row) => {
    setTargetEditVisible(true)
    const activeEditTargetView = row.view ? React.createElement(row.view, { viewRef: thisRef, tableHei }) : null
    dispatch({
      type: 'save',
      payload: {
        activeEditTargetView
      }
    })
  }, [thisRef, domainTargets])


  // 执行删除
  const handlerRemove = useCallback((selectedRows) => {
    const row = selectedRows[0]
    const actionDataTemp = _.cloneDeep(actionData)
    actionDataTemp.map((item, index, arr) => {
      if (item.id == row.id) {
        actionDataTemp.splice(index, 1)
      }
    })
    save({
      actionData: actionDataTemp,
    })
    dispatch({
      type: 'save',
      payload: {
        activeCreateTarget: {},
        stepCurrent: 0
      }
    })
    setSelectedRows([])
    setSelectedRowKeys([])
    setTargetCreateVisible(false)
  }, [actionData])

  // 动态创建目标条件面板
  const targetSteps = [
    {
      title: tr('第一步'),
      content: <div style={{ padding: '50px' }}>
        <div style={{ padding: '10px', textAlign: 'left' }}>{tr('授权目标')}:</div>
        <Select defaultValue="" style={{ width: '100%' }} value={activeCreateTarget.code} onChange={handleTargetSelectorChange} placeholder={tr("业务数据域数据")}>
          {_.map(domainTargets, (item) =>
            <Option value={item.code} key={item.code} name={item.label} view={item.view}>{item.label()}</Option>
          )}
        </Select>
      </div>,
    },
    {
      title: tr('第二步'),
      content: <>
        {(activeCreateTarget && activeCreateTargetView)
          ?
          activeCreateTargetView
          :
          <div className='aligncenter' style={{ padding: '10px', height: '100%' }}>
            {tr('无定义参数')}
          </div>
        }
      </>
    }
  ];



  // 执行编辑授权目标
  const handleEditTarget = useCallback(() => {
    const row = selectedRows[0]
    let parameterValue = thisRef.current ? thisRef.current.getValues() : '';
    if (parameterValue) {
      const { selectedRowKeys, selectedRows } = parameterValue
      parameterValue = selectedRowKeys[0]
    }
    const actionDataTemp = _.cloneDeep(actionData)
    actionDataTemp.map((item) => {
      if (item.code == row.code) {
        item.parameterValue = parameterValue
      }
    })
    save({
      actionData: actionDataTemp,
    })
    dispatch({
      type: 'save',
      payload: {
        activeEditTarget: {}
      }
    })
    setTargetEditVisible(false)
  }, [activeEditTargetView, selectedRows, selectedRowKeys, thisRef, actionData])

  // 弹出删除确认框
  const showRemoveModal = useCallback((rows) => {
    confirm({
      title: tr('提示?'),
      content: tr('确定删除这条数据过滤条件吗?'),
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      onOk() {
        return new Promise((resolve, reject) => {
          handlerRemove(selectedRows)
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows, handlerRemove])

  return <>
    {/* {!_.isEmpty(activeFilter) ?  */}
    <Table
      key={`datapermission:${currentUser.id}`}
      title={tr('授权目标')}
      columns={TargetColumns}
      dataSource={actionData}
      rowKey="id"
      hideVisibleMenu
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        clickable: true,
        onChange: (keys, rows) => {
          setSelectedRows(rows)
          setSelectedRowKeys(keys)
        },
      }}
      headerRight={<>
        <Button size="small" icon="plus" disabled={_.isEmpty(activeFilter)} onClick={handleCreateTargetClick} />
        <Button size="small" icon="edit" onClick={() => handleEditClick(selectedRows[0])} disabled={_.isEmpty(selectedRows)} />
        <Button size="small" icon="delete" type='danger' onClick={() => showRemoveModal()} disabled={_.isEmpty(selectedRows)} />
      </>}
      scroll={{ y: height }}
      headerProps={{
        type: 'line'
      }}
      emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择左侧数据过滤条件')}</div><div>{tr('或者新增')}</div></>}
    />
    <SmartModal
      title={tr("新增授权目标")}
      visible={targetCreateVisible}
      onCancel={cancelTargetCreate}
      itemState={{
        width: 1024,
        height: 768
      }}
      onSizeChange={(width, height) => setTableHei(height - 340)}
      footer={<>
        {stepCurrent > 0 && (
          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => dispatch({
              type: 'save',
              payload: { stepCurrent: stepCurrent - 1 }
            })}
          >
            {tr('上一步')}
          </Button>
        )}
        {stepCurrent < targetSteps.length - 1 && (
          <Button
            size="small"
            type="primary"
            disabled={_.isEmpty(activeCreateTarget)}
            onClick={() => dispatch({
              type: 'save',
              payload: { stepCurrent: stepCurrent + 1 }
            })}
          >
            {tr('下一步')}
          </Button>
        )}
        {stepCurrent === targetSteps.length - 1 && (
          <Button size="small" type="primary" onClick={handleCreateTarget}>
            {tr('确定')}
          </Button>
        )}
      </>}
    >
      <Steps current={stepCurrent}>
        {targetSteps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div
        className="steps-content"
        style={{
          height: 615
        }}
      >{targetSteps[stepCurrent].content}
      </div>
    </SmartModal>
    <SmartModal
      title={tr("修改授权目标参数")}
      visible={targetEditVisible}
      onCancel={() => setTargetEditVisible(false)}
      itemState={{
        width: 1024,
        // height: tableHei+260,
      }}
      onSizeChange={(width, height) => setTableHei(height - 300)}
      footer={<>
        <Button size="small" type="primary" onClick={handleEditTarget}>
          {tr('确定')}
        </Button>
      </>}
    >
      {activeEditTargetView}
    </SmartModal>
  </>
}

export default Targets
