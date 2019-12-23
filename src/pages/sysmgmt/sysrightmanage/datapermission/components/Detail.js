import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { Button, Tooltip, Modal, message, Menu, Row, Col, Drawer, Input, Switch, Steps, Select, Checkbox, Empty } from 'antd';
import { connect } from 'dva';
import { BlockHeader, Icon } from 'gantd';
import styles from './style.less';
import { tr, Card } from '@/components/common'
import { SearchTable, SmartModal } from '@/components/specific'
import { reducer } from '@/utils/utils'
import Filters from './Filters'
import Targets from './Targets'
import SchemaForm from '@/components/form/schema'

const { Step } = Steps;
const { Option } = Select;




const editSchema = {
  type: "object",
  required: ["memo", "active"],
  propertyType: {
    memo: {
      title: tr('说明'),
      type: "string",
      componentType: "Textarea",
    },
    active: {
      title: tr('是否生效'),
      type: "boolean",
      componentType: "Switch",
      options: {
        valuePropName: 'checked'
      }
    },
  }
}

const Page = props => {
  const {
    MAIN_CONFIG: { headerHeight }, data, currentUser, loading, modalVisible,
    allDomains, dataAcls, activeDataAcl = {}, filters, actions, domainFilters = [], actionData, activeFilter, domainTargets,
    getAllDomains, getDataAcls, getDomainFilters, getDomainActions, saveDataAcls, refreshDataSecurity, save, getDomainTargets,
    onClose, visible, modalFilterVisible, modalTargetVisible, selectedFiltersRowKeys,
    registerTarget, registerDomain, registerAction, registerFilter,
  } = props;

  const [contentHeight, setContentHeight] = useState(480)
  // 刷新授权
  const handleRefresh = useCallback(() => {
    refreshDataSecurity({ domainCode: activeDataAcl.code })
  }, [activeDataAcl])

  // 说明改变
  const handleMemoChange = (e) => {
    const activeDataAclTemp = _.cloneDeep(activeDataAcl)
    activeDataAclTemp.memo = e.target.value
    save({
      activeDataAcl: activeDataAclTemp
    })
  }
  // 是否生效
  const onSwitchChange = (value) => {
    const activeDataAclTemp = _.cloneDeep(activeDataAcl)
    activeDataAclTemp.active = value
    save({
      activeDataAcl: activeDataAclTemp
    })
  }

  // 关闭抽屉时
  const handleDrawerClose = useCallback(() => {
    save({
      actionData: [],
      activeFilter: {},
      selectedFiltersRowKeys: []
    })
    onClose();
  }, [])

  // 保存权限定义
  const handleSave = useCallback(() => {
    const activeFilterId = activeFilter.id;
    activeFilter.targets = []
    actionData.map((item, index, array) => {
      const actions = []
      delete item.id
      delete item.target
      // delete item.code
      delete item.label
      delete item.view
      // delete item.parameterValue
      Object.keys(item).map((key) => {
        if (key == 'id' || key == 'target' || key == 'code' || key == 'label' || key == 'view' || key == 'parameterValue') { return }
        actions.push({
          code: key,
          authorize: item[key]
        })
      })
      activeFilter.targets[index] = {
        code:item.code,
        parameterValue:item.parameterValue,
        actions
      }
    })
    const activeDataAclTemp = _.cloneDeep(activeDataAcl)
    activeDataAclTemp.filters = filters;
    const activeDataAclTempFiltersTemp = _.cloneDeep(activeDataAclTemp.filters)
    activeDataAclTempFiltersTemp.map((item, index, arr) => {
      if (item.id == activeFilterId) {
        activeDataAclTempFiltersTemp[index] = activeFilter
      }
    })
    dataAcls.map((item) => {
      if (item.id == activeDataAclTemp.id) {
        item.filters = activeDataAclTempFiltersTemp;
        item.memo = activeDataAclTemp.memo;
        item.active = activeDataAclTemp.active;
      }
    })
    saveDataAcls({
      dataAcls,
      domainCode: activeDataAclTemp.code
    }, handleDrawerClose)

  }, [dataAcls, activeDataAcl, filters, activeFilter, actionData])

  // 通过config的数据生成target label
  const generateTaregetLabel = useCallback((code, paramsValue = '') => {
    let label = ''
    registerTarget.map((item) => {
      if (item.code == code) {
        label = item.label(paramsValue)
      }
    })
    return label
  }, [registerTarget])

  const handleDataAclsBasicChange = useCallback((formContent) => {
    save({
      activeDataAcl: { ...activeDataAcl, ...formContent }
    })
  }, [activeDataAcl])

  return (
    <SmartModal
      title={`${tr('编辑权限约束定义')} ${activeDataAcl ? `-${activeDataAcl.memo}` : ''}`}
      onCancel={handleDrawerClose}
      visible={visible}
      footer={<>
        <Button size="small" className="marginh5" onClick={handleRefresh} loading={loading.effects['datapermission/refreshDataSecurity']}>{tr('刷新授权')}</Button>
        <Button size="small" type='primary' className="marginh5" loading={loading.effects['datapermission/saveDataAcls']} onClick={handleSave}>{tr('保存定义')}</Button>
              </>}
      itemState={{ height: 768, width: 1024 }}
      className={styles.modal}
      onSizeChange={(width, height) => setContentHeight(height - 293)}
    >
      <BlockHeader title={tr('基本信息')} type='line' />
      <SchemaForm
        schema={editSchema}
        uiSchema={{
          'ui:col': {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
            xxl: 12
          }
        }}
        data={activeDataAcl}
        onChange={handleDataAclsBasicChange}
      />
      <Row gutter={10}>
        <Col span={4} style={{ minWidth: '250px' }}>
          <Filters {...props} generateTaregetLabel={generateTaregetLabel} height={contentHeight} />
        </Col>
        <Col span={20} style={{ maxWidth: 'calc(100% - 250px)' }}>
          <Targets {...props} generateTaregetLabel={generateTaregetLabel} height={contentHeight} />
        </Col>
      </Row>
    </SmartModal>
  )
}

export default Page;
