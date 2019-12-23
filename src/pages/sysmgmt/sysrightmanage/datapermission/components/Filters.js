import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer } from 'react';
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
    selectedFiltersRowKeys,
    height
  } = props;
  const minHeight = getTableHeight(MAIN_CONFIG, 10);
  const [filterCreateVisible, setFilterCreateVisible] = useState(false)
  const [filterEditVisible, setFilterEditVisible] = useState(false)

  const [selectedRows, setSelectedRows] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  const [state, dispatch] = useReducer(reducer, {
    stepCurrent: 0,
    activeCreateFilter: {},
    activeCreateFilterView: {},
    activeEditFilterView: {}
  })
  const { stepCurrent, activeCreateFilter = {}, activeCreateFilterView = {}, activeEditFilterView = {} } = state;
  const thisRef = useRef()

  // 过滤条件定义
  const schemaFilter = [{
    key: 'label',
    dataIndex: 'label',
    title: tr('数据过滤条件'),
    render(value, record, index) {
      return <div className="dynamic_action_button_wrap">
        <div className="dynamic_action_text">{value(record.parameterValue)}</div>
        {selectedRows && selectedRows[0] && selectedRows[0].view && <Icon.Ant type="edit" className="dynamic_action_icon" onClick={() => handleEditClick(record)} />}
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

  // 点击edit
  const handleEditClick = useCallback((row) => {
    setFilterEditVisible(true)
    const activeEditFilterView = row.view ? React.createElement(row.view, { viewRef: thisRef }) : null
    dispatch({
      type: 'save',
      payload: {
        activeEditFilterView
      }
    })
  }, [thisRef])

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
          setSelectedRows([])
          setSelectedRowKeys([])
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows, handlerRemove])

  // 执行删除
  const handlerRemove = useCallback((selectedRows) => {
    const row = selectedRows[0]
    const filtersTemp = _.cloneDeep(filters)
    filtersTemp.map((item, index, arr) => {
      if (item.id == row.id) {
        filtersTemp.splice(index, 1)
      }
    })
    save({
      filters: filtersTemp,
    })
    dispatch({
      type: 'save',
      payload: {
        activeCreateFilter: {},
        stepCurrent: 0
      }
    })
    setFilterCreateVisible(false)
  }, [filters])

  // 打开新增过滤条件窗口
  const handleCreateFilterClick = useCallback(() => {
    setFilterCreateVisible(true)
    getDomainFilters({
      domainCode: activeDataAcl.code
    })
  }, [setFilterCreateVisible, getDomainFilters, activeDataAcl])

  // 关闭创建过滤条件
  const cancelFilterCreate = () => {
    dispatch({
      type: 'save',
      payload: {
        activeCreateFilter: {},
        stepCurrent: 0
      }
    })
    setFilterCreateVisible(false)
  }

  // 过滤条件改变
  const handleFilterSelectorChange = (value, item) => {
    dispatch({
      type: 'save',
      payload: {
        activeCreateFilter: {
          code: value,
          label: item.props.name,
          view: item.props.view,
          // parameterValue: ""
        },
        activeCreateFilterView: item.props.view ? React.createElement(item.props.view, { viewRef: thisRef }) : null
      }
    })
  }

  // 动态创建过滤条件面板
  const filterSteps = [
    {
      title: tr('第一步'),
      content: <div style={{ padding: '50px', height: '100%' }}>
        <div style={{ padding: '10px', textAlign: 'left' }}>{tr('业务数据域数据')}:</div>
        <Select defaultValue="" style={{ width: '100%' }} value={activeCreateFilter.code} onChange={handleFilterSelectorChange} placeholder="业务数据域数据">
          {_.map(domainFilters, (item) =>
            <Option value={item.code} key={item.code} name={item.label} view={item.view}>{item.label()}</Option>
          )}
        </Select>
      </div>,
    },
    {
      title: tr('第二步'),
      content: <>
        {(activeCreateFilter && activeCreateFilterView)
          ?
          activeCreateFilterView
          :
          <div className='aligncenter' style={{ padding: '10px', height: '100%' }}>
            {tr('无定义参数')}
          </div>
        }
      </>,
    }
  ];

  // 创建过滤条件
  const handleCreateFilter = useCallback(() => {
    console.log('thisRef.current', thisRef.current)
    let parameterValue = thisRef.current ? thisRef.current.getValues() : '';
    if (parameterValue) {
      const { selectedRowKeys, selectedRows } = parameterValue
      parameterValue = selectedRowKeys[0]
    }

    const filtersTemp = _.cloneDeep(filters)
    filtersTemp.push({
      ...activeCreateFilter,
      label: activeCreateFilter.label,
      id: filtersTemp.length,
      targets: [],
      parameterValue
    })
    save({
      filters: filtersTemp,
    })
    dispatch({
      type: 'save',
      payload: {
        activeCreateFilter: {},
        stepCurrent: 0
      }
    })
    setFilterCreateVisible(false)
  }, [activeCreateFilter, filters, activeCreateFilterView])

  const getTargetContent = (simpleTarget) => {
    const targetContent = registerTarget.find((item) => {
      return item.code == simpleTarget.code;
    });
    return targetContent
  }

  // 选择过滤器
  const handleFilterSelected = useCallback((keys, rows) => {
    if (_.isEmpty(keys)) { return }
    activeDataAcl.filters = filters;
    getDomainActions({ domainCode: activeDataAcl.code })
    save({
      activeFilter: rows[0],
    })
    const actionDataTemp = activeDataAcl.filters[rows[0].id];
    if (!actionDataTemp) return
    const { targets } = actionDataTemp;
    const data = []
    targets.map((item, index) => {
      const { actions } = item;
      const otherActions = {}
      actions.map((action) => {
        otherActions[action.code] = action.authorize
      })
      const targetContent = getTargetContent(item)
      data.push({
        id: index,
        // target: generateTaregetLabel(item.code, item.parameterValue),
        code: item.code,
        view: targetContent.view,
        label: targetContent.label,
        parameterValue: item.parameterValue || '',
        // target: item.label(item.parameterValue),
        ...otherActions
      })
    })
    save({
      actionData: data,
      selectedFiltersRowKeys: [rows[0].id]
    })
  }, [activeDataAcl, filters, generateTaregetLabel, getTargetContent])

  // 编辑过滤条件
  const handleEditFilter = useCallback(() => {
    const row = selectedRows[0]
    let parameterValue = thisRef.current ? thisRef.current.getValues() : '';
    if (parameterValue) {
      const { selectedRowKeys, selectedRows } = parameterValue
      parameterValue = selectedRowKeys[0]
    }
    const filtersTemp = _.cloneDeep(filters)
    filtersTemp.map((item) => {
      if (item.code == row.code) {
        item.parameterValue = parameterValue0
      }
    })
    save({
      filters: filtersTemp,
    })
    dispatch({
      type: 'save',
      payload: {
        activeEditFilter: {}
      }
    })
    setFilterEditVisible(false)
  }, [activeEditFilterView, selectedRows, selectedRowKeys, thisRef, filters])

  return <>
    <Table
      key="datapermission_detail_filter"
      title={tr('数据过滤条件')}
      columns={schemaFilter}
      dataSource={filters}
      rowKey='id'
      hideVisibleMenu
      headerRight={<>
        <Button size="small" icon="plus" onClick={handleCreateFilterClick} />
        <Button size="small" icon="edit" onClick={() => handleEditClick(selectedRows[0])} disabled={_.isEmpty(selectedRows) || !selectedRows[0].view} />
        <Button size="small" icon="delete" type='danger' onClick={() => showRemoveModal()} disabled={_.isEmpty(selectedRows)} />
      </>}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        clickable: true,
        onChange: (keys, rows) => {
          setSelectedRows(rows)
          setSelectedRowKeys(keys)
          handleFilterSelected(keys, rows)
        },
      }}
      scroll={{ y: height }}
      headerProps={{
        type: 'line'
      }}
      emptyDescription={<><div>{tr('暂无数据')}</div>{tr('请新增')}<div /></>}
    />
    <SmartModal
      title={tr("新增权限约束")}
      visible={filterCreateVisible}
      onCancel={cancelFilterCreate}
      itemState={{
        width: 1024,
        height: 768,
      }}
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
        {stepCurrent < filterSteps.length - 1 && (
          <Button
            size="small"
            type="primary"
            disabled={_.isEmpty(activeCreateFilter)}
            onClick={() => dispatch({
              type: 'save',
              payload: { stepCurrent: stepCurrent + 1 }
            })}
          >
            {tr('下一步')}
          </Button>
        )}
        {stepCurrent === filterSteps.length - 1 && (
          <Button size="small" type="primary" onClick={handleCreateFilter}>
            {tr('确定')}
          </Button>
        )}
      </>}
    >
      <Steps current={stepCurrent}>
        {filterSteps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div
        className="steps-content"
        style={{
          height: 615
        }}
      >{filterSteps[stepCurrent].content}
      </div>
    </SmartModal>
    <SmartModal
      title={tr("修改权限约束")}
      visible={filterEditVisible}
      onCancel={() => setFilterEditVisible(false)}
      itemState={{
        width: 1024,
        height: 768,
      }}
      footer={<>
        <Button size="small" type="primary" onClick={handleEditFilter}>
          {tr('确定')}
        </Button>
      </>}
    >
      {activeEditFilterView}
    </SmartModal>
  </>
}

export default Targets
