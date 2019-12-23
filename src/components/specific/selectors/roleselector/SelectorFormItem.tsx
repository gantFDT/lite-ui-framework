import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Icon } from 'antd'
import { connect } from 'dva'
import classnames from 'classnames'
import { isEmpty } from 'lodash'
import { Selector, Group, EditStatus, withEdit } from 'gantd'
import SelectorModal from './SelectorModal'
import { getRoleField, getRoleInfo } from '@/utils/role'
import PopoverCard from '../components/PopoverCard'
import { fields, nameKeys } from './static'
import { renderlinkEle } from '../utils'
import styles from '../styles.less'
const { dropDownEleKey, popoverEleKey } = nameKeys;

const SelectorFormItem = (props: any) => {
  const {
    value,
    valueProp,
    labelProp,
    multiple,
    addonAfter,
    onChange,
    dispatch,
    withAuth,
    selectLoading,
    userId,
    listRoles,
    listRolesByAuth,
    listRolesFilters,
    listRole4selector,
    ...restProps
  } = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch()
  }, [])

  const fetch = useCallback(() => {
    if (withAuth && listRolesByAuth.length || !withAuth && listRoles.length) return;
    dispatch({ type: 'selectors/fetchAllRole', payload: { withAuth } })
  }, [withAuth, listRoles, listRolesByAuth])

  //弹窗onOK事件
  const handlerChange = useCallback((selectedRowKeys: string[]) => {
    let ret: any = multiple ? selectedRowKeys : selectedRowKeys[0];
    onChange && onChange(!multiple ? ret : ret.length ? ret : null)
    setVisible(false)
  }, [])

  //select下拉框搜索
  const handlerSelectorSearch = useCallback((keywords: any) => {
    if (keywords) {
      dispatch({ type: 'selectors/fetchAllRole', payload: { withAuth, keywords } })
    } else {
      dispatch({ type: 'selectors/save', payload: { listRolesFilters: null } })
    }
  }, [withAuth])

  //select下拉框选择
  const handlerSelectorChange = useCallback((ret: any) => {
    onChange && onChange(ret)
  }, [])

  const handlerSelectorBlur = useCallback(() => {
    dispatch({ type: 'selectors/save', payload: { listRolesFilters: null } })
  }, [dispatch])

  const dataSource = useMemo(() => {
    return listRolesFilters ? listRolesFilters : withAuth && listRolesByAuth || listRoles;
  }, [withAuth, listRoles, listRolesByAuth, listRolesFilters]);

  const getLabelText = useCallback((value, cb) => {
    dataSource.forEach((role: any) => role[valueProp] == value ? cb(role.roleName) : null)
  }, [dataSource, valueProp])

  const renderItem = useCallback((role: any, Option: any) => {
    return <Option key={role[valueProp]} value={role[valueProp]} >
      <span>{`${role.roleName}-${role.roleCode}`}</span>
    </Option>
  }, [valueProp])

  const optionLabel = useMemo(() => {
    if (!value) return;
    const fn = (id: string) => {
      let item = getRoleInfo(id);
      if (isEmpty(item)) return value;
      return `${item.roleName}-${item.roleCode}`
    }
    if (Array.isArray(value)) {
      return value.map(id => fn(id)).join('、')
    } else {
      return fn(value)
    }
  }, [value])

  return (
    <Group gant>
      <div className={styles.professionalSelector}>
        <div style={{ top: 1 }} className={classnames(styles.selectWrap, addonAfter ? styles.editSelector : null)}>
          <Selector
            defaultList={dataSource}
            dropdownClassName={dropDownEleKey}
            value={value}
            loading={selectLoading}
            multiple={multiple}
            selectorId={`RoleSelector:${userId}`}
            valueProp={valueProp}
            labelProp={labelProp}
            getLabelText={getLabelText}
            isFilter={false}
            optionLabel={optionLabel}
            onSearch={handlerSelectorSearch}
            onChange={handlerSelectorChange}
            onBlur={handlerSelectorBlur}
            renderItem={renderItem}
            edit={EditStatus.EDIT}
            {...restProps}
          />
          <Icon className={styles.searchIcon} type="search" onClick={() => setVisible(true)} />
        </div>
        <SelectorModal
          onCancel={() => setVisible(false)}
          multiple={multiple}
          onOk={handlerChange}
          visible={visible}
          valueProp={valueProp}
          withAuth={withAuth}
          value={multiple ? value : value && [value]}
        />
      </div>
      {addonAfter ? <span className="ant-input-group-addon">{addonAfter}</span> : null}
    </Group>
  )
}
SelectorFormItem.defaultProps = {
  multiple: false,
  allowClear: true,
  valueProp: 'id',
  labelProp: 'roleName',
  withAuth: false
}

function renderReadElement(props: any) {
  const { value, showMode, linkTo, customShow } = props;
  if (Array.isArray(value)) {
    return value.map(id => getRoleField({ id }) || id).join('、')
  }
  if (!value) return;
  let name = getRoleField({ id: value });
  let record = getRoleInfo(value);
  if (isEmpty(record)) return value;
  switch (showMode) {
    case 'popover':
      return <PopoverCard data={record} fields={fields} nameKey='roleName' overlayClassName={popoverEleKey} />
    case 'link':
      return renderlinkEle(value, name, linkTo)
    case 'mixed':
      return <PopoverCard trigger='hover' data={record} fields={fields} nameKey='roleName' overlayClassName={popoverEleKey}>
        {renderlinkEle(value, name, linkTo)}
      </PopoverCard>
    case 'custom':
      return customShow && customShow(value, record);
    default:
      return name;
  }
}

const EditSelector = withEdit((props: any) => renderReadElement(props))(SelectorFormItem);

function ConnectComp(props: any) {
  return <EditSelector {...props} />
}

export default connect(({ selectors, user, loading }: any) => ({
  userId: user.currentUser.id,
  listRoles: selectors.listRoles,
  listRolesByAuth: selectors.listRolesByAuth,
  listRolesFilters: selectors.listRolesFilters,
  listRole4selector: selectors.listRole4selector,
  selectLoading: loading.effects['selectors/fetchAllRole'],
})
)(ConnectComp);