import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Icon, Avatar } from 'antd'
import { connect } from 'dva'
import classnames from 'classnames'
import { Selector, Group, EditStatus, withEdit } from 'gantd'
import SelectorModal from './SelectorModal'
import { nameKeys } from './static'
import UserColumn from '@/components/specific/usercolumn'
import { getImageById } from '@/utils/utils'
import { renderlinkEle, getUserLabels, getUserRecord } from '../utils'
import styles from '../styles.less'
const { dropDownEleKey, popoverEleKey } = nameKeys;

const SelectorFormItem = (props: any) => {
  const {
    userId,
    listUsers,
    listUsersByAuth,
    listUsersFilters,
    value,
    valueProp,
    labelProp,
    onChange,
    multiple,
    addonAfter,
    dispatch,
    withAuth,
    ...restProps
  } = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch()
  }, [])

  const fetch = useCallback(() => {
    if (withAuth && listUsersByAuth.length || !withAuth && listUsers.length) return;
    dispatch({ type: 'selectors/fetchAllUser', payload: { withAuth } })
  }, [withAuth, listUsers, listUsersByAuth])

  //弹窗onOK事件
  const handlerChange = useCallback((selectedRowKeys: string[]) => {
    let ret: any = multiple ? selectedRowKeys : selectedRowKeys[0];
    // 兼容 Selector 的value不支持number格式
    if (Array.isArray(ret)) {
      ret = valueProp === 'id' ? ret.map(v => Number(v)) : ret;
    } else {
      ret = valueProp === 'id' && ret ? Number(ret) : ret;
    }
    onChange && onChange(ret)
    setVisible(false)
  }, [value, multiple])

  //select下拉框搜索
  const handlerSelectorSearch = useCallback((keywords: any) => {
    if (keywords) {
      dispatch({ type: 'selectors/fetchAllUser', payload: { withAuth, keywords } })
    } else {
      dispatch({ type: 'selectors/save', payload: { listUsersFilters: null } })
    }
  }, [withAuth])

  //select下拉框选择
  const handlerSelectorChange = useCallback((ret: any) => {
    // 兼容 Selector 的value不支持number格式
    if (Array.isArray(ret)) {
      ret = valueProp === 'id' ? ret.map(v => Number(v)) : ret;
    } else {
      ret = valueProp === 'id' && ret ? Number(ret) : ret;
    }
    onChange && onChange(ret)
  }, [])

  const handlerSelectorBlur = useCallback(() => {
    dispatch({ type: 'selectors/save', payload: { listUsersFilters: null } })
  }, [dispatch])

  const selectorValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(V => V.toString())
    }
    return value && value.toString()
  }, [value]);

  const dataSource = useMemo(() => {
    return listUsersFilters ? listUsersFilters : withAuth && listUsersByAuth || listUsers;
  }, [withAuth, listUsers, listUsersByAuth, listUsersFilters]);

  const getLabelText = useCallback((value, cb) => {
    dataSource.forEach((user: any) => user[valueProp] == value ? cb(user.userName) : null)
  }, [dataSource, valueProp])

  const renderLabel = useCallback((user) => {
    return <>
      <Avatar icon="user" size="small" src={getImageById(user.pictureId)} style={{ marginRight: 15 }} alt="avatar" />
      <span>{user.userName}</span>
    </>
  }, [])

  const renderItem = useCallback((user: any, Option?: any) => {
    return <Option key={user[valueProp]} value={user[valueProp]}>{renderLabel(user)}</Option>
  }, [valueProp])

  const optionLabel = useMemo(() => {
    if (!value) return;
    let isLoginName = valueProp && valueProp == 'userLoginName';
    if (Array.isArray(value)) return getUserLabels(value, isLoginName);
    let record = getUserRecord(value, isLoginName);
    if (!record) return value;
    return renderLabel(record);
  }, [value, valueProp])

  return (
    <>
      <Group gant>
        <div className={styles.professionalSelector}>
          <div style={{ top: 1 }} className={classnames(styles.selectWrap, addonAfter ? styles.editSelector : null)}>
            <Selector
              defaultList={dataSource}
              dropdownClassName={dropDownEleKey}
              value={selectorValue}
              allowClear
              multiple={multiple}
              selectorId={`UserSelector:${userId}`}
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
      </Group >
    </>
  )
}
SelectorFormItem.defaultProps = {
  multiple: false,
  valueProp: 'id',
  labelProp: 'userName',
  showMode: 'simple',
  withAuth: false
}

function renderReadElement(props: any) {
  const { value, showMode, linkTo, customShow, valueProp } = props;
  let isLoginName = valueProp && valueProp == 'userLoginName';

  if (!value) return;
  if (Array.isArray(value)) return getUserLabels(value, isLoginName);
  let record = getUserRecord(value, isLoginName);
  if (!record) return value;
  let name = record && record['userName'];
  switch (showMode) {
    case 'popover':
      return <UserColumn id={record['id']} overlayClassName={popoverEleKey} />
    case 'link':
      return renderlinkEle(value, name, linkTo)
    case 'mixed':
      return <UserColumn id={record['id']} tigger='hover' overlayClassName={popoverEleKey} />
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
  listUsers: selectors.listUsers,
  listUsersByAuth: selectors.listUsersByAuth,
  listUsersFilters: selectors.listUsersFilters,
  userId: user.currentUser.id,
  selectLoading: loading.effects['selectors/fetchAllUser'],
}))(ConnectComp)